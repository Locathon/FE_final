import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PhotoSelectScreen from '../screens/Places/PhotoSelectScreen';
import PlaceDetailScreen from '../screens/Places/PlaceDetailScreen';
import PlaceListScreen from '../screens/Places/PlaceListScreen';
import PlaceSearchScreen from '../screens/Places/PlaceSearchScreen';
import PlaceWriteScreen from '../screens/Places/PlaceWriteScreen';

const Stack = createNativeStackNavigator();

const PlaceStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="PlaceList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlaceList" component={PlaceListScreen} />
      <Stack.Screen name="PlaceWrite" component={PlaceWriteScreen} />
      <Stack.Screen name="PhotoSelect" component={PhotoSelectScreen} />
      <Stack.Screen name="PlaceSearch" component={PlaceSearchScreen} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} />
    </Stack.Navigator>
  );
};

export default PlaceStackNavigator;