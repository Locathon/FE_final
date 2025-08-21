// C:\Users\mnb09\Desktop\Temp\screens\Courses\CourseSearchScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { allCourses, Course } from '../../data/courseData';
import { CourseStackParamList } from '../../navigation/CourseNavigator';

type CourseSearchNavigationProp = NativeStackNavigationProp<
  CourseStackParamList,
  'CourseSearchScreen'
>;

export default function CourseSearchScreen() {
  const navigation = useNavigation<CourseSearchNavigationProp>();
  const [query, setQuery] = useState('');

  const filteredCourses = query
    ? allCourses.filter((course) =>
        course.title.toLowerCase().includes(query.toLowerCase())
      )
    : allCourses;

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('CourseDetailScreen', { courseId: item.id })
      }
    >
      <Image source={item.thumbnail} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.author}>by {item.author}</Text>
          <View style={styles.likesContainer}>
            <Ionicons name="heart" size={14} color="#EB5757" />
            <Text style={styles.likesText}>{item.likes}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#828282"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="코스 이름을 검색해보세요"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      </View>

      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    marginLeft: 12,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  listContainer: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6E6E73',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 13,
    color: '#8E8E93',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#3C3C43',
  },
});
