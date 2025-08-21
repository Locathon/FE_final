import { Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// [수정] 중앙 데이터 소스에서 필요한 데이터와 함수를 import 합니다.
import { addMyCourse, courseDetailsMap, Place, recommendedCourses } from '../../data/courseData';

export default function EditCourseScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // [수정] 외부에서 전달받은 courseId 또는 추천 코스 첫 번째 항목을 기본값으로 사용
  const initialCourseId = route.params?.courseId || recommendedCourses[0]?.id;
  const [sourceCourseId, setSourceCourseId] = useState(initialCourseId);

  const [showDropdown, setShowDropdown] = useState(false);
  const [isCopyMode, setIsCopyMode] = useState(false);
  
  // [수정] 복사할 코스의 제목과 장소 목록을 state로 관리합니다.
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const [completionModalVisible, setCompletionModalVisible] = useState(false);

  // [수정] 선택된 ID에 따라 courseDetailsMap에서 코스 정보를 가져옵니다.
  const sourceCourse = useMemo(() => {
    return courseDetailsMap.get(sourceCourseId);
  }, [sourceCourseId]);

  // 장소 선택/해제 토글 함수
  const togglePlaceSelection = (place: Place) => {
    setSelectedPlaces((prevSelected) =>
      prevSelected.some((p) => p.id === place.id)
        ? prevSelected.filter((p) => p.id !== place.id)
        : [...prevSelected, place]
    );
  };

  // 저장(복사) 처리 함수
  const handleCopyCourse = () => {
    if (!newCourseTitle.trim()) {
      alert('복사할 코스의 이름을 입력해주세요.');
      return;
    }
    if (!sourceCourse) {
        alert('원본 코스를 찾을 수 없습니다.');
        return;
    }
    
    // [수정] courseData.ts의 addMyCourse 함수를 호출하여 새 코스를 저장
    addMyCourse({
        title: newCourseTitle,
        places: selectedPlaces,
        originalAuthor: sourceCourse.author
    });
    
    setCopyModalVisible(false);
    setCompletionModalVisible(true);
  };
  
  // 최종 확인 후 '나의 코스' 화면으로 이동
  const handleCompletion = () => {
    setCompletionModalVisible(false);
    navigation.navigate('my-courses');
  };

  if (!sourceCourse) {
    return <SafeAreaView style={styles.container}><Text>코스 정보를 불러올 수 없습니다.</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>코스 가져오기</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.label}>어떤 코스를 가져올까요?</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowDropdown(prev => !prev)}>
            <Text style={styles.courseTitle}>{sourceCourse.title}</Text>
            <Entypo name={showDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
          </TouchableOpacity>
          {showDropdown && (
            <View style={styles.dropdown}>
              {recommendedCourses.map(course => (
                <TouchableOpacity
                  key={course.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSourceCourseId(course.id);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={{ color: sourceCourseId === course.id ? '#00AEEF' : '#000', fontWeight: sourceCourseId === course.id ? 'bold' : 'normal' }}>
                    {course.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>1. 가져올 장소를 선택해주세요.</Text>
        </View>
        
        {sourceCourse.places.map((place) => {
          const isSelected = selectedPlaces.some((p) => p.id === place.id);
          return (
            <TouchableOpacity key={place.id} style={styles.placeRow} onPress={() => togglePlaceSelection(place)}>
              <Ionicons name={isSelected ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={isSelected ? '#00AEEF' : '#ccc'} style={{ marginRight: 12 }} />
              <Image source={place.thumbnail} style={styles.thumbnail} />
              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddress}>{place.address}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ marginTop: 30 }}>
          <Text style={styles.sectionTitle}>2. 새로운 코스 이름을 지어주세요.</Text>
          <TextInput
            placeholder="예: 나의 행궁동 힐링 코스"
            value={newCourseTitle}
            onChangeText={setNewCourseTitle}
            style={styles.titleInput}
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.saveButton, { backgroundColor: selectedPlaces.length === 0 ? '#ccc' : '#000' }]} disabled={selectedPlaces.length === 0} onPress={() => setCopyModalVisible(true)}>
        <Text style={styles.saveText}>선택한 장소로 코스 만들기 ({selectedPlaces.length})</Text>
      </TouchableOpacity>

      {/* 복사 확인 모달 */}
      <Modal transparent visible={copyModalVisible} animationType="fade" onRequestClose={() => setCopyModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>코스를 복사하시겠어요?</Text>
            <Text style={styles.modalMessage}>'{newCourseTitle}' 이름으로 나의 코스에 추가됩니다.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setCopyModalVisible(false)}>
                <Text style={styles.modalButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonConfirm]} onPress={handleCopyCourse}>
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>복사하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* 완료 모달 */}
      <Modal transparent visible={completionModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.completionContent}>
                <Ionicons name="checkmark-circle" size={80} color="#00AEEF" style={{ marginBottom: 20 }} />
                <Text style={styles.modalTitle}>복사가 완료됐어요!</Text>
                <Text style={styles.modalMessage}>'나의 찜 리스트'의 '코스' 탭에서 확인하세요.</Text>
                <TouchableOpacity style={styles.completionButton} onPress={handleCompletion}>
                    <Text style={styles.completionButtonText}>확인</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    dropdownButton: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, justifyContent: 'space-between' },
    courseTitle: { fontSize: 16, fontWeight: '500' },
    dropdown: { backgroundColor: '#fff', borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: '#ddd' },
    dropdownItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f2f2f2' },
    sectionHeader: { marginTop: 30, marginBottom: 12 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold' },
    placeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomColor: '#eee', borderBottomWidth: 1 },
    thumbnail: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
    placeInfo: { flex: 1 },
    placeName: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
    placeAddress: { fontSize: 13, color: '#555' },
    titleInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginTop: 12, fontSize: 16 },
    saveButton: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingVertical: 24, alignItems: 'center', justifyContent: 'center' },
    saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { width: '100%', backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center' },
    completionContent: { width: '100%', backgroundColor: '#fff', padding: 30, borderRadius: 12, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    modalMessage: { fontSize: 15, color: '#666', marginBottom: 24, textAlign: 'center', lineHeight: 22 },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
    modalButton: { flex: 1, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginHorizontal: 5 },
    modalButtonCancel: { backgroundColor: '#eee' },
    modalButtonConfirm: { backgroundColor: '#000' },
    modalButtonText: { fontSize: 16, fontWeight: '500' },
    completionButton: { backgroundColor: '#00AEEF', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center' },
    completionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
