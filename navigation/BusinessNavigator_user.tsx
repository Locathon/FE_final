import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// 주요 화면 컴포넌트 import
import AutoQnAScreen from '../screens/BusinessTab/AutoQnAScreen';
import { default as EditProfileScreen, default as EditStore } from '../screens/BusinessTab/EditProfileScreen';
import GenerateMarketingScreen from '../screens/BusinessTab/GenerateMarketingScreen';
import MarketingDetailScreen from '../screens/BusinessTab/MarketingDetailScreen';
import NewPostScreen from '../screens/BusinessTab/NewPostScreen';
import NotificationScreen from '../screens/BusinessTab/NotificationScreen';
import PhotoPickerScreen from '../screens/BusinessTab/PhotoPickerScreen';
import PostDetailScreen from '../screens/BusinessTab/PostDetailScreen';
import QAPreviewScreen from '../screens/BusinessTab/QAPreviewScreen';
import QASetupScreen from '../screens/BusinessTab/QASetupScreen';
import RegisterStore from '../screens/BusinessTab/RegisterStore';
import StoreMain from '../screens/BusinessTab/StoreMain';
import StoreHomeScreen_user from '../screens/BusinessTab/StoreHomeScreen_user';
const Stack = createNativeStackNavigator();

export default function BusinessNavigator() {
  return (
    // [문제 2 해결] initialRouteName을 'BusinessHome'으로 명확하게 지정하여
    // 주민의 소상공인 탭의 첫 화면이 항상 StoreMain이 되도록 수정합니다.
    <Stack.Navigator initialRouteName="StoreMain" screenOptions={{ headerShown: false, headerTitle: '' }}>
      <Stack.Screen name="BusinessHome_user" component={StoreHomeScreen_user} />
      <Stack.Screen name="StoreMain" component={StoreMain} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="AutoQnAScreen" component={AutoQnAScreen} />
      <Stack.Screen name="NewPostScreen" component={NewPostScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="QASetup" component={QASetupScreen} />
      <Stack.Screen name="QAPreview" component={QAPreviewScreen} />
      <Stack.Screen name="GenerateMarketing" component={GenerateMarketingScreen} />
      <Stack.Screen name="MarketingDetail" component={MarketingDetailScreen} />
      <Stack.Screen name="PhotoPicker" component={PhotoPickerScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="RegisterStore" component={RegisterStore} />
      <Stack.Screen name="EditStore" component={EditStore} />
    </Stack.Navigator>
  );
}
