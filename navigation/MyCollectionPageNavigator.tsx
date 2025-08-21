// C:\Users\mnb09\Desktop\Temp\navigation\MyCollectionPageNavigator.tsx

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// 충돌된 두 브랜치의 모든 import 항목을 병합합니다.
import account_settings from '../screens/MyCollectionPage/account-settings';
import app_setting from '../screens/MyCollectionPage/app-setting';
import edit_profile from '../screens/MyCollectionPage/edit-profile';
import Guide from '../screens/MyCollectionPage/guide';
import my_courses from '../screens/MyCollectionPage/my-courses';
import my_reivews from '../screens/MyCollectionPage/my-reviews';
import mypage from '../screens/MyCollectionPage/mypage';
import Privacy from '../screens/MyCollectionPage/privacy';
import ResidentAuthScreen from '../screens/MyCollectionPage/ResidentAuthScreen';
import Settings from '../screens/MyCollectionPage/settings';
import Terms from '../screens/MyCollectionPage/terms';
import MyPlacesScreen from '../screens/MyCollectionPage/my-places';
import PlaceDetailScreen from '../screens/Places/PlaceDetailScreen';
import MapCourseScreen from '../screens/MyCollectionPage/MapCourseScreen.jsx';
import EditCourseScreen from '../screens/MyCollectionPage/EditCourseScreen';

const Stack = createNativeStackNavigator();

const MyCollectionPageNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="mypage" screenOptions={{ headerShown: false }}>
        {/* 두 브랜치에 공통으로 있던 화면들 */}
        <Stack.Screen name="mypage" component={mypage} />
        <Stack.Screen name="edit_profile" component={edit_profile} />
        <Stack.Screen name="my-courses" component={my_courses} />
        <Stack.Screen name="my-reviews" component={my_reivews} />
        <Stack.Screen name="my-places" component={MyPlacesScreen} />
        <Stack.Screen name="app-setting" component={app_setting} />
        <Stack.Screen name="account-settings" component={account_settings} />
        <Stack.Screen name="settings" component={Settings} />
        <Stack.Screen name="terms" component={Terms} />
        <Stack.Screen name="privacy" component={Privacy} />
        <Stack.Screen name="guide" component={Guide} />
        <Stack.Screen name="ResidentAuth" component={ResidentAuthScreen} />

        {/* main 브랜치에 새로 추가되었던 화면들 */}
        <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} />
        <Stack.Screen name="MapCourseScreen" component={MapCourseScreen} />
        <Stack.Screen name="EditCourseScreen" component={EditCourseScreen} />
    </Stack.Navigator>
  );
};

export default MyCollectionPageNavigator;
