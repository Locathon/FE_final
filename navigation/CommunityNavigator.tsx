import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// --- 화면 Import ---
import CommentListScreen from '../screens/Community/CommentListScreen';
import CommunityScreen from '../screens/Community/CommunityScreen';
import CreatePostScreen from '../screens/Community/CreatePostScreen';
import EditPostScreen from '../screens/Community/EditPostScreen';
import PostDetailScreen from '../screens/Community/PostDetailScreen';
import UserProfileScreen from '../screens/Community/UserProfileScreen';
// 새로 추가된 화면 import
import NotificationScreen from '../screens/Community/NotificationScreen';
import SearchScreen from '../screens/Community/SearchScreen';

export type CommunityStackParamList = {
  CommunityHome: undefined;
  PostDetail: { postId: string };
  CreatePost: undefined;
  EditPost: { postId: string };
  CommentList: { postId: string };
  UserProfile: { userId: string };
  Search: undefined; // 검색 화면 타입 추가
  Notification: undefined; // 알림 화면 타입 추가
};

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export default function CommunityNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="CommunityHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="CommunityHome" component={CommunityScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="EditPost" component={EditPostScreen} />
      <Stack.Screen name="CommentList" component={CommentListScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      {/* 새로 추가된 화면 등록 */}
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
}
