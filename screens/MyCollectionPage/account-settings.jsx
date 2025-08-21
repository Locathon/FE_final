// app/account-settings.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AccountSettingsScreen() {
  const router = useRouter();

  const handleChangeEmail = () => {
    Alert.alert('이메일 변경', '이메일 변경 기능은 준비 중입니다.');
    // TODO: 이메일 변경 화면으로 이동 또는 모달 표시
  };

  const handleChangePassword = () => {
    Alert.alert('비밀번호 변경', '비밀번호 변경 기능은 준비 중입니다.');
    // TODO: 비밀번호 변경 화면으로 이동 또는 모달 표시
  };

  const handleDeactivateAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '정말로 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '탈퇴하기', onPress: () => console.log('회원 탈퇴 처리'), style: 'destructive' },
        // TODO: 실제 회원 탈퇴 로직 구현
      ]
    );
  };

  const menuItems = [
    { id: 'change-email', title: '이메일 주소 변경', action: handleChangeEmail, icon: 'mail-outline' },
    { id: 'change-password', title: '비밀번호 변경', action: handleChangePassword, icon: 'lock-closed-outline' },
    // { id: 'linked-accounts', title: '연결된 계정 관리', action: () => {}, icon: 'link-outline' }, // 소셜 로그인 연동 후 추가 고려
  ];

  return (
    <>
      <Stack.Screen options={{ title: '계정 관리' }} />
      <ScrollView style={styles.container}>
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
              <Ionicons name={item.icon} size={22} color="#4F4F4F" style={styles.icon} />
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dangerZoneSection}>
          <TouchableOpacity
            style={[styles.menuItem, styles.deactivateButton]}
            onPress={handleDeactivateAccount}
          >
            <Ionicons name="trash-outline" size={22} color="#FF3B30" style={styles.icon} />
            <Text style={[styles.menuText, styles.deactivateButtonText]}>회원 탈퇴</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  menuSection: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  dangerZoneSection: {
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 17,
    color: '#000000',
  },
  deactivateButton: {
    // borderTopWidth: 0.5, // 필요시 상단 구분선
    // borderTopColor: '#E0E0E0',
  },
  deactivateButtonText: {
    color: '#FF3B30', // 빨간색으로 경고 표시
  },
});
