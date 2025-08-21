import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { CommunityStackParamList } from '../../navigation/CommunityNavigator';

// 이 화면의 route 타입을 정의합니다.
type CommentListScreenRouteProp = RouteProp<CommunityStackParamList, 'CommentList'>;

const CommentListScreen = () => {
  // route 객체에서 postId를 추출합니다.
  const route = useRoute<CommentListScreenRouteProp>();
  const { postId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>댓글 전체보기 화면</Text>
      <Text style={styles.info}>게시물 ID: {postId}</Text>
      {/* 여기에 해당 게시물의 댓글 목록을 불러와 표시하는 UI가 구현될 예정입니다. */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: {
      fontSize: 16,
      marginTop: 10,
  }
});

export default CommentListScreen;
