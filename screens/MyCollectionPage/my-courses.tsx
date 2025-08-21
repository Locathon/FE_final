// screens/MyCollectionPage/my-courses.tsx

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { myCourses as myCoursesFromData, savedCourses as savedCoursesFromData } from '../../data/courseData';

// 화면에 표시될 아이템의 타입을 정의합니다.
type CourseItem = {
    id: string;
    title: string;
    subtitle: string;
    thumbnail: ImageSourcePropType;
    author: string;
};

export default function MyCoursesScreen() {
    const navigation = useNavigation<any>();
    const [selectedTab, setSelectedTab] = useState<'my' | 'saved'>('my');
    const [courses, setCourses] = useState<CourseItem[]>([]);

    useFocusEffect(
        useCallback(() => {
            console.log(`my-courses 화면 포커스됨: '${selectedTab}' 탭 데이터 갱신`);
            
            if (selectedTab === 'my') {
                const formattedMyCourses = myCoursesFromData.map(c => ({
                    id: c.id,
                    title: c.title,
                    subtitle: c.subtitle,
                    thumbnail: c.thumbnail,
                    author: c.author,
                }));
                setCourses(formattedMyCourses);
            } else {
                const formattedSavedCourses = savedCoursesFromData.map(c => ({
                    id: c.id,
                    title: c.title,
                    subtitle: c.subtitle,
                    thumbnail: c.thumbnail,
                    author: c.author,
                }));
                setCourses(formattedSavedCourses);
            }
        }, [selectedTab])
    );


    const renderCourseItem = ({ item }: { item: CourseItem }) => (
        <TouchableOpacity 
            style={styles.courseRow} 
            onPress={() => {
                // [수정] 사용자의 요청에 따라 'EditCourseScreen'으로 이동하는 네비게이션을 복원합니다.
                // 이를 통해 코스 복사/수정 기능으로 진입할 수 있습니다.
                // 참고: 현재 EditCourseScreen은 선택된 코스의 데이터를 받아 수정하는 기능이 아니라,
                // 자체적인 샘플 목록에서 코스를 선택하여 복사하도록 되어 있습니다.
                // 선택한 'item'을 직접 수정하려면 EditCourseScreen의 수정이 필요합니다.
                navigation.navigate('EditCourseScreen', { courseId: item.id });
            }}
        >
            <Image source={item.thumbnail} style={styles.courseThumbnail} />
            <View style={styles.courseTextContainer}>
                <Text style={styles.courseTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.courseSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                <Text style={styles.courseAuthor}>{item.author}</Text>
            </View>
            <Ionicons name="bookmark" size={20} color={selectedTab === 'saved' ? "#00AEEF" : "#BDBDBD"} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>나의 코스</Text>
                <View style={styles.headerIcon} />
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'my' && styles.activeTab]}
                    onPress={() => setSelectedTab('my')}
                >
                    <Text style={[styles.tabText, selectedTab === 'my' && styles.activeTabText]}>
                        내 코스 ({myCoursesFromData.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'saved' && styles.activeTab]}
                    onPress={() => setSelectedTab('saved')}
                >
                    <Text style={[styles.tabText, selectedTab === 'saved' && styles.activeTabText]}>
                        저장한 코스 ({savedCoursesFromData.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={courses}
                renderItem={renderCourseItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {selectedTab === 'my' ? '생성된 코스가 없습니다.' : '저장한 코스가 없습니다.'}
                        </Text>
                        <Text style={styles.emptySubtext}>
                            {selectedTab === 'my' ? '새로운 코스를 추가해보세요!' : '마음에 드는 코스를 저장해보세요!'}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
    headerIcon: { width: 24, alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center', color: '#222' },
    listContainer: { paddingHorizontal: 16, paddingBottom: 16 },
    tabContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 8, marginHorizontal: 16, marginTop: 8 },
    tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    activeTab: { borderBottomColor: '#000' },
    tabText: { fontSize: 16, color: '#B0B0B0', fontWeight: '500' },
    activeTabText: { color: '#000000', fontWeight: 'bold' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '40%' },
    emptyText: { fontSize: 18, fontWeight: '600', color: '#4F4F4F' },
    emptySubtext: { fontSize: 14, color: '#828282', marginTop: 8 },
    courseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    courseThumbnail: { width: 80, height: 80, borderRadius: 8, marginRight: 16, backgroundColor: '#F2F2F2' },
    courseTextContainer: { flex: 1, justifyContent: 'center' },
    courseTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 4 },
    courseSubtitle: { fontSize: 13, color: '#666', marginBottom: 6 },
    courseAuthor: { fontSize: 12, color: '#888' },
});
