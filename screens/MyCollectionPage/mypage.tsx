import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

// [오류 수정] 1. 메뉴 아이템에 대한 명확한 타입을 정의합니다.
// icon의 타입을 Ionicons가 가진 name들의 집합으로 지정하여 타입 안정성을 확보합니다.
type MenuItem = {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  count?: number; // 활동 통계에서만 사용되므로 optional '?' 처리
};

const MyPageScreen = () => {
  const navigation = useNavigation();
  const { isLoggedIn, logout } = useAuth();

  const userNickname = '성이름';
  const userProfileImageUrl = require('../../assets/images/default-profile.png');

  <Image
    source={userProfileImageUrl}
    style={styles.profileImage}
  />

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: async () => {
          await logout();
          Alert.alert('로그아웃', '로그아웃 되었습니다.');
        },
      },
    ]);
  };

  const activityStats = {
    places: isLoggedIn ? 12 : 0,
    courses: isLoggedIn ? 5 : 0,
    reviews: isLoggedIn ? 8 : 0,
  };
  
  // [오류 수정] 2. 정의한 MenuItem 타입을 배열에 적용합니다.
  const activityItems: MenuItem[] = [
    { id: 'my-courses', title: '내가 기록한 코스', icon: 'map-outline', count: activityStats.courses },
    { id: 'my-places', title: '내가 기록한 장소', icon: 'location-outline', count: activityStats.places },
    { id: 'my-reviews', title: '내가 남긴 후기', icon: 'chatbubble-ellipses-outline', count: activityStats.reviews },
  ];

  const settingItems: MenuItem[] = [
    { id: 'ResidentAuth', title: '주민 인증', icon: 'shield-checkmark-outline' },
    { id: 'settings', title: '설정', icon: 'settings-outline' },
    { id: 'guide', title: '이용 가이드', icon: 'book-outline' },
    { id: 'terms', title: '이용약관 및 정책', icon: 'document-text-outline' },
  ];

  // [오류 수정] 3. render 함수의 파라미터 타입을 'any' 대신 'MenuItem'으로 명확하게 지정합니다.
  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => navigation.navigate(item.id as never)}>
      <View style={styles.menuItemContent}>
        <Ionicons name={item.icon} size={22} color="#4F4F4F" style={styles.menuIcon} />
        <Text style={styles.menuTitle}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color="#C7C7CC" />
    </TouchableOpacity>
  );

  return (
    
    <SafeAreaView style={styles.container}>
        <View style={{alignItems: 'center' }}>
          <Text style={styles.headerTitle}>마이페이지</Text>
        </View>
      
      <ScrollView>
        {/* 마이페이지 타이틀 */}
        {/* <Text style={{ fontSize: 18, fontWeight: 'bold', alignSelf: 'center', marginVertical: 12 }}>마이페이지</Text> */}

        {/* 프로필 카드 */}
        <View style={{ position: 'relative', marginTop: 16 }}>
          <View style={{
            backgroundColor: '#fff',
            marginHorizontal: 16,
            borderRadius: 12,
            padding: 20,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={userProfileImageUrl}
                style={styles.profileImage}
              />
              <View style={{ marginLeft: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{userNickname}</Text>
                <Text style={{ color: '#828282', marginTop: 4 }}>ID12340808</Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#EAF6FF',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
              }}
              onPress={() => navigation.navigate('edit_profile' as never)}
            >
              <Image
                source={require('../../assets/images/edit.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('my-courses' as never)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F7F9FB',
                borderRadius: 10,
                paddingVertical: 12,
                paddingHorizontal: 16,
                marginTop: 20,
              }}
            >
              <Ionicons name="archive-outline" size={20} color="#00AEEF" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 16, color: '#000', alignItems: 'center' }}>마이 컬렉션</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 설정 구분선 */}
        <Text style={{ marginLeft: 16, marginTop: 24, marginBottom: 4, color: '#9E9E9E' }}>설정</Text>
        <View style={styles.menuSection}>
          {renderMenuItem(settingItems[0])}
          {renderMenuItem(settingItems[1])}
        </View>

        {/* 고객센터 구분선 */}
        <Text style={{ marginLeft: 16, marginTop: 24, marginBottom: 4, color: '#9E9E9E' }}>고객센터</Text>
        <View style={styles.menuSection}>
          {renderMenuItem(settingItems[2])}
          {renderMenuItem(settingItems[3])}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
  height: 56,
  justifyContent: 'center',
  alignItems: 'flex-start',
  paddingHorizontal: 16,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: '#E0E0E0',
},
headerTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#333',
},
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  profileSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 20, },
  profileImage: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#005B9E' },
  profileInfo: { flex: 1, marginLeft: 16 },
  nickname: { fontSize: 20, fontWeight: 'bold' },
  editProfileText: { fontSize: 14, color: '#828282', marginTop: 4 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 10, marginHorizontal: 16, marginTop: 12, paddingVertical: 8 },
  activityRow: { flexDirection: 'row', justifyContent: 'space-around' },
  activityItem: { alignItems: 'center', padding: 8, },
  activityTitle: { fontSize: 14, color: '#4F4F4F', marginTop: 8 },
  activityCount: { fontSize: 20, fontWeight: 'bold', color: '#2F80ED', marginTop: 4 },
  menuSection: { backgroundColor: '#FFFFFF', borderRadius: 10, marginHorizontal: 16, marginTop: 12, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: '#E0E0E0' },
  menuItemContent: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 16 },
  menuTitle: { fontSize: 16 },
});

export default MyPageScreen;
