// app/my-reviews.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 임시 후기 데이터
const dummyReviews = [
  { id: '1', placeName: '행궁동 어느 카페', rating: 5, content: '분위기도 좋고 커피도 맛있었어요! 또 가고 싶네요.', date: '2025.05.28' },
  { id: '2', placeName: '수원화성 야경 맛집', rating: 4, content: '밤에 보니 정말 아름다웠습니다. 다만 사람이 좀 많았어요.', date: '2025.05.15' },
  { id: '3', title: '나의 첫번째 코스', courseName: '행궁동 산책 코스', content: '이 코스 정말 추천합니다! 사진 찍기 좋아요.', date: '2025.06.01', type: 'course_review'},
];

export default function MyReviewsScreen() {
  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      {item.type === 'course_review' ? (
        <Text style={styles.itemTitle}>코스: {item.courseName}</Text>
      ) : (
        <Text style={styles.itemTitle}>장소: {item.placeName}</Text>
      )}
      {item.rating && (
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < item.rating ? 'star' : 'star-outline'}
              size={18}
              color="#FFCC00"
            />
          ))}
        </View>
      )}
      <Text style={styles.reviewContent}>{item.content}</Text>
      <Text style={styles.reviewDate}>{item.date}</Text>
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>수정/삭제</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ title: '내가 남긴 후기' }} />
      <FlatList
        data={dummyReviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>아직 작성한 후기가 없어요.</Text>}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  reviewItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewContent: {
    fontSize: 15,
    color: '#3C3C43',
    marginBottom: 8,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 13,
    color: '#8A8A8E',
    textAlign: 'right',
    marginBottom: 8,
  },
  editButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});
