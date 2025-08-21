// app/account-settings.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AccountSettingsScreen() {
  const router = useRouter();

  const handleChangeEmail = () => {
    Alert.alert('이메일 변경', '이메일 변경 기능은 준비 중입니다. 실제 구현 시 새 화면 또는 모달이 필요합니다.');
    // 예: router.push('/change-email-screen');
  };

  const handleChangePassword = () => {
    Alert.alert('비밀번호 변경', '비밀번호 변경 기능은 준비 중입니다. 실제 구현 시 새 화면 또는 모달이 필요합니다.');
    // 예: router.push('/change-password-screen');
  };

  const handleDeactivateAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '정말로 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제될 수 있습니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '탈퇴하기', 
          onPress: () => {
            console.log('회원 탈퇴 처리 로직 실행');
            // TODO: 실제 회원 탈퇴 API 호출 및 후처리
            Alert.alert('탈퇴 처리됨', '계정이 비활성화되었습니다 (실제로는 삭제 처리).');
            // router.replace('/'); // 홈으로 이동 등
          },
          style: 'destructive',
        },
      ]
    );
  };

  const menuItems = [
    { id: 'email', title: '이메일 주소 변경', action: handleChangeEmail, iconName: 'mail-outline' as const },
    { id: 'password', title: '비밀번호 변경', action: handleChangePassword, iconName: 'lock-closed-outline' as const },
    // { id: 'notifications', title: '알림 설정', action: () => router.push('/notification-settings'), iconName: 'notifications-outline' as const },
    // { id: 'linked-accounts', title: '연결된 계정', action: () => router.push('/linked-accounts'), iconName: 'link-outline' as const },
  ];

  return (
    <>
      <Stack.Screen options={{ title: '계정 관리' }} />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
              <Ionicons name={item.iconName} size={22} color="#333" style={styles.icon} />
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleDeactivateAccount}
          >
            <Ionicons name="trash-bin-outline" size={22} color="#FF3B30" style={styles.icon} />
            <Text style={[styles.menuText, styles.dangerText]}>회원 탈퇴</Text>
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
    backgroundColor: '#F2F2F7', // 피그마 배경색과 유사하게
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'hidden', // for borderRadius on children
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  icon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 17,
    color: '#000',
  },
  dangerText: {
    color: '#FF3B30',
  },
});
