import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ResidentAuthScreen() {
  const navigation = useNavigation();

  const handleAuthPress = () => {
    // TODO: 나중에 실제 주민 인증 로직 (외부 API 연동 등)을 연결할 부분입니다.
    Alert.alert(
      '인증 준비 중',
      '현재 주민 인증 기능은 준비 중입니다. 곧 이 기능을 통해 행궁동 주민들을 위한 더 많은 혜택을 제공할 예정입니다!',
      [{ text: '확인' }]
    );
    console.log('주민 인증 시작 버튼 클릭');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주민 인증</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        <Ionicons name="shield-checkmark-outline" size={80} color="#2F80ED" style={styles.icon} />
        <Text style={styles.title}>행궁동 주민이신가요?</Text>
        <Text style={styles.subtitle}>
          주민 인증을 통해 느린행궁의 더 많은 혜택과{'\n'}
          커뮤니티 기능을 이용해보세요!
        </Text>
        <TouchableOpacity style={styles.authButton} onPress={handleAuthPress}>
          <Text style={styles.authButtonText}>주민 인증하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#828282',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  authButton: {
    backgroundColor: '#2F80ED',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
