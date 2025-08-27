import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NotFoundScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>페이지를 찾을 수 없어요</Text>
      <Text style={styles.subtitle}>요청하신 화면이 존재하지 않습니다.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>돌아가기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#1c1c1e', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  button: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#111827', borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '600' },
});

export default NotFoundScreen;
