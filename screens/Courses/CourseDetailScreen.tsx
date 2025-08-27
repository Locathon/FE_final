// C:\Users\mnb09\Desktop\Temp\screens\Courses\CourseDetailScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { STYLES } from '../../constants/styles';
import { Course, courseDetailsMap } from '../../data/courseData';
import { CourseStackParamList } from '../../navigation/CourseNavigator';

type CourseDetailScreenNavigationProp = NativeStackNavigationProp<
  CourseStackParamList,
  'CourseDetailScreen'
>;

type RouteParams = {
  courseId: string;
};

const screenWidth = Dimensions.get('window').width;

export default function CourseDetailScreen() {
  const navigation = useNavigation<CourseDetailScreenNavigationProp>();
  const route = useRoute<{ params: RouteParams }>();
  const { courseId } = route.params;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showARModal, setShowARModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [distance, setDistance] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadCourseData();
      checkFavoriteStatus();
      calculateRouteInfo();
    }, [courseId])
  );

  const loadCourseData = () => {
    const courseData = courseDetailsMap.get(courseId);
    if (courseData) {
      setCourse(courseData);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        // API 호출로 즐겨찾기 상태 확인
        setIsFavorite(false); // 기본값
      }
    } catch (_err) {
      setIsFavorite(false);
    }
  };

  const calculateRouteInfo = () => {
    if (!course) return;
    
    // 거리 계산 (간단한 예시)
    const totalDistance = course.places.length * 0.5; // km
    setDistance(totalDistance);
    
    // 예상 소요 시간 계산 (도보 기준)
    const walkingTime = totalDistance * 20; // 분
    setEstimatedTime(walkingTime);
  };

  const toggleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        Alert.alert('로그인 필요', '즐겨찾기를 사용하려면 로그인이 필요합니다.');
        return;
      }

      setIsFavorite(!isFavorite);
      Alert.alert(
        isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가',
        isFavorite ? '즐겨찾기에서 제거되었습니다.' : '즐겨찾기에 추가되었습니다.'
      );
    } catch (_err) {
      Alert.alert('오류', '즐겨찾기 처리 중 오류가 발생했습니다.');
    }
  };

  const startCourse = () => {
    setIsStarted(true);
    setCurrentPlaceIndex(0);
    setProgress(0);
    Alert.alert('코스 시작', '코스가 시작되었습니다! 첫 번째 장소로 이동하세요.');
  };

  const completePlace = (placeIndex: number) => {
    if (placeIndex === currentPlaceIndex) {
      const newProgress = ((placeIndex + 1) / course!.places.length) * 100;
      setProgress(newProgress);
      
      if (placeIndex < course!.places.length - 1) {
        setCurrentPlaceIndex(placeIndex + 1);
        Alert.alert('장소 완료', '다음 장소로 이동하세요!');
      } else {
        // 코스 완주
        setShowCompletionModal(true);
        setIsStarted(false);
      }
    }
  };

  const shareCourse = () => {
    Alert.alert('공유', `${course?.title} 코스를 공유합니다.`);
  };

  const openARNavigation = () => {
    setShowARModal(true);
  };

  const renderPlaceItem = ({ item, index }: { item: any; index: number }) => {
    const isCompleted = index < currentPlaceIndex;
    const isCurrent = index === currentPlaceIndex;
    const isUpcoming = index > currentPlaceIndex;

    return (
      <TouchableOpacity
        style={[
          styles.placeItem,
          isCompleted && styles.completedPlace,
          isCurrent && styles.currentPlace,
          isUpcoming && styles.upcomingPlace,
        ]}
        onPress={() => completePlace(index)}
        disabled={!isStarted || isUpcoming}
      >
        <View style={styles.placeHeader}>
          <View style={styles.placeNumber}>
            <Text style={styles.placeNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.placeInfo}>
            <Text style={styles.placeName}>{item.name}</Text>
            <Text style={styles.placeAddress}>{item.address}</Text>
          </View>
          <View style={styles.placeStatus}>
            {isCompleted && (
              <Ionicons name="checkmark-circle" size={24} color={STYLES.COLORS.SUCCESS} />
            )}
            {isCurrent && (
              <Ionicons name="location" size={24} color={STYLES.COLORS.PRIMARY} />
            )}
            {isUpcoming && (
              <Ionicons name="ellipse-outline" size={24} color="#DDD" />
            )}
          </View>
        </View>
        
        <Image source={item.thumbnail} style={styles.placeImage} />
        
        {isCurrent && isStarted && (
          <View style={styles.currentPlaceActions}>
            <TouchableOpacity style={styles.arButton} onPress={openARNavigation}>
              <Ionicons name="camera" size={16} color="#fff" />
              <Text style={styles.arButtonText}>AR 내비게이션</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.completeButton} 
              onPress={() => completePlace(index)}
            >
              <Text style={styles.completeButtonText}>방문 완료</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>코스를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {course.title}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleFavorite} style={styles.headerButton}>
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? '#FF6B6B' : '#333'} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareCourse} style={styles.headerButton}>
            <Ionicons name="share-social-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        {/* 코스 썸네일 */}
        <Image source={course.thumbnail} style={styles.thumbnail} />
        
        {/* 코스 정보 */}
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
          
          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.statText}>{course.places.length}개 장소</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.statText}>{estimatedTime}분</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="walk-outline" size={16} color="#666" />
              <Text style={styles.statText}>{distance.toFixed(1)}km</Text>
            </View>
          </View>

          {/* 진행률 표시 */}
          {isStarted && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>진행률: {Math.round(progress)}%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>
          )}

          {/* 코스 시작/재시작 버튼 */}
          <TouchableOpacity 
            style={[styles.startButton, isStarted && styles.restartButton]} 
            onPress={startCourse}
          >
            <Text style={styles.startButtonText}>
              {isStarted ? '코스 재시작' : '코스 시작하기'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 코스 경로 지도 */}
        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>코스 경로</Text>
          <MapView style={styles.map}>
            {course.places.map((place, index) => (
              <Marker
                key={place.id}
                coordinate={{ latitude: 37.5665 + index * 0.001, longitude: 127.001 + index * 0.001 }}
                title={place.name}
                description={`${index + 1}번째 장소`}
                pinColor={index === currentPlaceIndex && isStarted ? '#007AFF' : '#FF3B30'}
              />
            ))}
            {isStarted && course.places.length > 1 && (
              <Polyline
                coordinates={course.places.map((place, index) => ({
                  latitude: 37.5665 + index * 0.001,
                  longitude: 127.001 + index * 0.001,
                }))}
                strokeColor="#007AFF"
                strokeWidth={3}
              />
            )}
          </MapView>
        </View>

        {/* 장소 목록 */}
        <View style={styles.placesSection}>
          <Text style={styles.sectionTitle}>방문할 장소</Text>
          <FlatList
            data={course.places}
            renderItem={renderPlaceItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* 코스 설명 */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>코스 소개</Text>
          <Text style={styles.descriptionText}>
            {course.description || '이 코스에 대한 자세한 설명이 없습니다.'}
          </Text>
        </View>
      </ScrollView>

      {/* AR 내비게이션 모달 */}
      <Modal visible={showARModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.arModalContainer}>
          <View style={styles.arModalHeader}>
            <TouchableOpacity onPress={() => setShowARModal(false)}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
            <Text style={styles.arModalTitle}>AR 내비게이션</Text>
            <View style={{ width: 50 }} />
          </View>
          
          <View style={styles.arContent}>
            <Text style={styles.arInstruction}>
              카메라를 장소 방향으로 향기면 AR 화살표가 표시됩니다.
            </Text>
            <View style={styles.arPreview}>
              <Ionicons name="camera" size={80} color="#007AFF" />
              <Text style={styles.arPreviewText}>AR 카메라 뷰</Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* 코스 완주 모달 */}
      <Modal visible={showCompletionModal} animationType="fade" transparent>
        <View style={styles.completionModalOverlay}>
          <View style={styles.completionModal}>
            <View style={styles.completionIcon}>
              <Ionicons name="trophy" size={60} color="#FFD700" />
            </View>
            <Text style={styles.completionTitle}>코스 완주!</Text>
            <Text style={styles.completionMessage}>
              축하합니다! {course.title} 코스를 성공적으로 완주했습니다.
            </Text>
            <TouchableOpacity 
              style={styles.completionButton}
              onPress={() => setShowCompletionModal(false)}
            >
              <Text style={styles.completionButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    justifyContent: 'space-between', 
    backgroundColor: '#fff', 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderColor: '#d1d5db', 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowOffset: { width: 0, height: 1 }, 
    shadowRadius: 4, 
    elevation: 2 
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1c1c1e', flex: 1, textAlign: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  headerButton: { marginLeft: 16 },
  thumbnail: { width: '100%', height: 200, resizeMode: 'cover' },
  courseInfo: { 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    marginTop: 20, 
    borderRadius: 16, 
    padding: 20, 
    shadowColor: '#000', 
    shadowOpacity: 0.07, 
    shadowOffset: { width: 0, height: 6 }, 
    shadowRadius: 12, 
    elevation: 4 
  },
  courseTitle: { fontSize: 24, fontWeight: '700', color: '#1c1c1e', marginBottom: 8 },
  courseSubtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  courseStats: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12
  },
  statItem: { alignItems: 'center' },
  statText: { fontSize: 14, color: '#666', marginTop: 4 },
  progressContainer: { marginBottom: 20 },
  progressText: { fontSize: 14, fontWeight: '600', color: '#1c1c1e', marginBottom: 8 },
  progressBar: { 
    height: 8, 
    backgroundColor: '#f1f3f4', 
    borderRadius: 4, 
    overflow: 'hidden' 
  },
  progressFill: { 
    height: '100%', 
    backgroundColor: STYLES.COLORS.PRIMARY, 
    borderRadius: 4 
  },
  startButton: { 
    backgroundColor: STYLES.COLORS.PRIMARY, 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  restartButton: { backgroundColor: STYLES.COLORS.SECONDARY },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  mapSection: { 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    marginTop: 20, 
    borderRadius: 16, 
    padding: 18, 
    shadowColor: '#000', 
    shadowOpacity: 0.07, 
    shadowOffset: { width: 0, height: 6 }, 
    shadowRadius: 12, 
    elevation: 4 
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1c1c1e', marginBottom: 16 },
  map: { height: 200, borderRadius: 12 },
  placesSection: { 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    marginTop: 20, 
    borderRadius: 16, 
    padding: 18, 
    shadowColor: '#000', 
    shadowOpacity: 0.07, 
    shadowOffset: { width: 0, height: 6 }, 
    shadowRadius: 12, 
    elevation: 4 
  },
  placeItem: { 
    backgroundColor: '#f8f9fa', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12 
  },
  completedPlace: { backgroundColor: '#e8f5e8', borderLeftWidth: 4, borderLeftColor: STYLES.COLORS.SUCCESS },
  currentPlace: { backgroundColor: '#e3f2fd', borderLeftWidth: 4, borderLeftColor: STYLES.COLORS.PRIMARY },
  upcomingPlace: { backgroundColor: '#f8f9fa' },
  placeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  placeNumber: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: STYLES.COLORS.PRIMARY, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  placeNumberText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  placeInfo: { flex: 1 },
  placeName: { fontSize: 16, fontWeight: '600', color: '#1c1c1e', marginBottom: 4 },
  placeAddress: { fontSize: 14, color: '#666' },
  placeStatus: { marginLeft: 12 },
  placeImage: { width: '100%', height: 120, borderRadius: 8, marginBottom: 12 },
  currentPlaceActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 12 
  },
  arButton: { 
    flex: 1, 
    backgroundColor: '#FF6B6B', 
    paddingVertical: 12, 
    borderRadius: 8, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  arButtonText: { color: '#fff', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  completeButton: { 
    flex: 1, 
    backgroundColor: STYLES.COLORS.SUCCESS, 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  completeButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  descriptionSection: { 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    marginTop: 20, 
    marginBottom: 40, 
    borderRadius: 16, 
    padding: 18, 
    shadowColor: '#000', 
    shadowOpacity: 0.07, 
    shadowOffset: { width: 0, height: 6 }, 
    shadowRadius: 12, 
    elevation: 4 
  },
  descriptionText: { fontSize: 15, color: '#3c3c4399', lineHeight: 24 },
  arModalContainer: { flex: 1, backgroundColor: '#000' },
  arModalHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    backgroundColor: '#000' 
  },
  closeButton: { color: '#fff', fontSize: 16 },
  arModalTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  arContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  arInstruction: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 40 },
  arPreview: { alignItems: 'center' },
  arPreviewText: { color: '#fff', fontSize: 14, marginTop: 16 },
  completionModalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  completionModal: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 30, 
    alignItems: 'center', 
    marginHorizontal: 40 
  },
  completionIcon: { marginBottom: 20 },
  completionTitle: { fontSize: 24, fontWeight: '700', color: '#1c1c1e', marginBottom: 12 },
  completionMessage: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  completionButton: { 
    backgroundColor: STYLES.COLORS.PRIMARY, 
    paddingHorizontal: 32, 
    paddingVertical: 16, 
    borderRadius: 12 
  },
  completionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
