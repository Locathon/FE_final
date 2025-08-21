// C:\Users\mnb09\Desktop\Temp\navigation\CourseNavigator.tsx

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Place } from '../data/courseData';

// 각 화면이 어떤 정보를 주고받을지 약속(정의)합니다.
export type CourseStackParamList = {
  CourseHomeScreen: undefined;
  CourseListScreen: undefined;
  CourseSearchScreen: undefined;
  CourseDetailScreen: { courseId: string };
  CourseCreateScreen: { courseId?: string | undefined; updatedPlaces?: Place[] };
  PlaceSearchScreen: { currentPlaces: Place[] };
};

const Stack = createNativeStackNavigator<CourseStackParamList>();

// [해결] 필요한 모든 화면 컴포넌트를 정확한 경로에서 import 합니다.
import CourseCreateScreen from '../screens/Courses/CourseCreateScreen';
import CourseDetailScreen from '../screens/Courses/CourseDetailScreen';
import CourseHomeScreen from '../screens/Courses/CourseHomeScreen';
import CourseListScreen from '../screens/Courses/CourseListScreen';
import CourseSearchScreen from '../screens/Courses/CourseSearchScreen';
import PlaceSearchScreen from '../screens/Courses/PlaceSearchScreen';

const CourseNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="CourseHomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="CourseHomeScreen" component={CourseHomeScreen} />
      <Stack.Screen name="CourseListScreen" component={CourseListScreen} />
      <Stack.Screen name="CourseSearchScreen" component={CourseSearchScreen} />
      
      {/* [해결] 이 라인이 누락되었을 가능성이 높습니다. 화면을 네비게이터에 등록합니다. */}
      <Stack.Screen name="CourseDetailScreen" component={CourseDetailScreen} />
      
      <Stack.Screen name="CourseCreateScreen" component={CourseCreateScreen} />
      <Stack.Screen name="PlaceSearchScreen" component={PlaceSearchScreen} />
    </Stack.Navigator>
  );
};

export default CourseNavigator;
