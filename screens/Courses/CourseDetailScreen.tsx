// C:\Users\mnb09\Desktop\Temp\screens\Courses\CourseDetailScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { courseDetailsMap, deleteCourse, savedCourses, toggleSaveCourse } from '../../data/courseData';
import { CourseStackParamList } from '../../navigation/CourseNavigator';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type CourseDetailRouteProp = RouteProp<CourseStackParamList, 'CourseDetailScreen'>;
type CourseDetailNavigationProp = NativeStackNavigationProp<CourseStackParamList, 'CourseDetailScreen'>;

export default function CourseDetailScreen() {
  const navigation = useNavigation<CourseDetailNavigationProp>();
  const route = useRoute<CourseDetailRouteProp>();
  
  const { courseId } = route.params || {};
  const course = useMemo(() => courseId ? courseDetailsMap.get(courseId) : undefined, [courseId]);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const refreshStates = useCallback(() => {
    if (courseId) {
      const currentCourse = courseDetailsMap.get(courseId);
      if (currentCourse) {
        setIsSaved(savedCourses.some(c => c.id === courseId));
        setLikeCount(currentCourse.likes);
      }
    }
  }, [courseId]);

  useFocusEffect(refreshStates);

  const handleToggleSave = () => {
    if (course) {
      toggleSaveCourse(course);
      refreshStates(); 
    }
  };

  const handleToggleLike = () => {
    if (course) {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
      course.likes = newIsLiked ? course.likes + 1 : course.likes - 1;
    }
  };

  const handleDelete = () => {
    if (course) {
      deleteCourse(courseId);
      setDeleteModalVisible(false);
      navigation.goBack();
      Alert.alert("코스가 삭제되었습니다.");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity onPress={handleToggleSave} style={styles.headerButton}>
            <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleLike} style={styles.headerButton}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color="white" />
          </TouchableOpacity>
          {course?.isMyCourse && (
            <TouchableOpacity onPress={() => setDeleteModalVisible(true)} style={styles.headerButton}>
              <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, isLiked, isSaved, course]);

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>코스 정보를 불러올 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const coordinates = course.places.map(p => p.coordinate);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coordinates[0]?.latitude || 37.28,
            longitude: coordinates[0]?.longitude || 127.01,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          }}
        >
          {coordinates.length > 1 && <Polyline coordinates={coordinates} strokeColor="#007AFF" strokeWidth={4} />}
          {course.places.map((place, index) => (
            <Marker key={place.id} coordinate={place.coordinate} title={place.name}>
              <View style={styles.markerContainer}><Text style={styles.markerText}>{index + 1}</Text></View>
            </Marker>
          ))}
        </MapView>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.subtitle}>{course.subtitle}</Text>
          <Text style={styles.description}>{course.description}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.author}>by {course.author}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="heart" size={16} color="#FF3B30" style={{ marginRight: 4 }} />
              <Text style={styles.likes}>{likeCount}</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <Text style={styles.listTitle}>포함된 장소</Text>
          <View style={styles.placeListContainer}>
            {course.places.map((place, index) => (
              <React.Fragment key={place.id}>
                {index > 0 && <View style={styles.pathInfo}><Text style={styles.pathText}>{place.time || '15분'}</Text></View>}
                <View style={styles.placeItem}>
                  <View style={styles.placeNumber}><Text style={styles.placeNumberText}>{index + 1}</Text></View>
                  <View>
                    <Text style={styles.placeName}>{place.name}</Text>
                    <Text style={styles.placeAddress}>{place.address}</Text>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>
          {course.isMyCourse && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('CourseCreateScreen', { courseId: course.id })}
            >
              <Text style={styles.editButtonText}>이 코스 수정하기</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
       <Modal animationType="fade" transparent={true} visible={deleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)} >
         <View style={styles.modalContainer}>
           <View style={styles.modalContent}>
             <Text style={styles.modalTitle}>코스 삭제</Text>
             <Text style={styles.modalMessage}>정말로 이 코스를 삭제하시겠어요? 삭제된 코스는 복구할 수 없어요.</Text>
             <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setDeleteModalVisible(false)}>
                    <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={handleDelete}>
                    <Text style={styles.confirmButtonText}>삭제</Text>
                </TouchableOpacity>
             </View>
           </View>
         </View>
       </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', padding: 10, position: 'absolute', top: 40, left: 10, zIndex: 1 },
  headerButton: { padding: 8, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20 },
  headerRightContainer: { flexDirection: 'row', gap: 12 },
  map: { width: screenWidth, height: screenHeight * 0.4 },
  markerContainer: { backgroundColor: '#007AFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderColor: 'white', borderWidth: 2 },
  markerText: { color: 'white', fontWeight: 'bold' },
  contentContainer: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20, backgroundColor: 'white', minHeight: screenHeight * 0.6 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#828282', marginTop: 4, marginBottom: 16 },
  description: { fontSize: 15, lineHeight: 22, color: '#4F4F4F' },
  metaContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  author: { fontSize: 14, color: '#828282' },
  likes: { fontSize: 14, color: '#4F4F4F' },
  separator: { height: 1, backgroundColor: '#EAEAEA', marginVertical: 20 },
  listTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  placeListContainer: {},
  pathInfo: { alignItems: 'center', marginVertical: 8 },
  pathText: { color: '#007AFF', fontSize: 13, backgroundColor: '#F2F2F7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  placeItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  placeNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  placeNumberText: { color: 'white', fontWeight: 'bold' },
  placeName: { fontSize: 17, fontWeight: '600' },
  placeAddress: { fontSize: 14, color: '#828282', marginTop: 2 },
  editButton: { backgroundColor: '#007AFF', padding: 16, marginHorizontal: 20, marginVertical: 10, borderRadius: 12, alignItems: 'center' },
  editButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: 'white', borderRadius: 14, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalMessage: { fontSize: 15, textAlign: 'center', color: '#4F4F4F', marginBottom: 20, lineHeight: 22 },
  modalActions: { flexDirection: 'row', width: '100%' },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#EFEFF4' },
  cancelButtonText: { color: '#007AFF', fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#FF3B30' },
  confirmButtonText: { color: 'white', fontWeight: 'bold' },
});
