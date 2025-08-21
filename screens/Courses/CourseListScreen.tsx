// C:\Users\mnb09\Desktop\Temp\screens\Courses\CourseListScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { allCourses, Course, savedCourses } from '../../data/courseData';
import { CourseStackParamList } from '../../navigation/CourseNavigator';

type CourseListNavigationProp = NativeStackNavigationProp<
  CourseStackParamList,
  'CourseListScreen'
>;

export default function CourseListScreen() {
  const navigation = useNavigation<CourseListNavigationProp>();
  // FEATURE (5): 탭 상태에 'saved' 추가
  const [activeTab, setActiveTab] = useState<'recommended' | 'my' | 'saved'>('recommended');
  const [courses, setCourses] = useState<Course[]>([]);

  // FEATURE (5): 화면 포커스 시 또는 탭 변경 시 목록 업데이트
  useFocusEffect(
    useCallback(() => {
      let data: Course[] = [];
      if (activeTab === 'recommended') {
        data = allCourses.filter(course => !course.isMyCourse);
      } else if (activeTab === 'my') {
        data = allCourses.filter(course => course.isMyCourse);
      } else if (activeTab === 'saved') {
        // data/courseData.ts 에서 최신 상태를 가져옴
        data = [...savedCourses];
      }
      setCourses(data);
    }, [activeTab]) // activeTab이 변경될 때마다 이 효과를 다시 실행
  );


  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('CourseDetailScreen', { courseId: item.id })
      }
    >
      <Image source={item.thumbnail} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.cardInfo}>
            <Text style={styles.author}>by {item.author}</Text>
            <View style={styles.likesContainer}>
                <Ionicons name="heart" size={12} color="#8E8E93" />
                <Text style={styles.likesText}>{item.likes}</Text>
            </View>
        </View>
        <Text style={styles.cardSubtitle} numberOfLines={1}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>전체 코스</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'recommended' && styles.activeTab]}
          onPress={() => setActiveTab('recommended')}
        >
          <Text style={[styles.tabText, activeTab === 'recommended' && styles.activeTabText]}>추천 코스</Text>
        </TouchableOpacity>
        {/* FEATURE (5): 저장한 코스 탭 버튼 추가 */}
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>저장한 코스</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>나의 코스</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => `${activeTab}-${item.id}`}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EAEAEA', },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 16, marginBottom: 8, },
  tabButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 10, backgroundColor: '#F2F2F7', },
  activeTab: { backgroundColor: '#007AFF', },
  tabText: { color: '#8E8E93', fontWeight: '500', },
  activeTabText: { color: '#FFFFFF', },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20, },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3, marginBottom: 16, },
  thumbnail: { width: '100%', height: 150, borderTopLeftRadius: 12, borderTopRightRadius: 12, },
  cardContent: { padding: 12, },
  cardTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 8, },
  cardInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, },
  author: { fontSize: 13, color: '#8E8E93', },
  likesContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 12, },
  likesText: { marginLeft: 4, fontSize: 13, color: '#8E8E93', },
  cardSubtitle: { fontSize: 14, color: '#666', },
});
