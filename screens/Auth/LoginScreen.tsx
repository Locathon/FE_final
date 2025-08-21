// C:\Users\mnb09\Desktop\Temp\screens\Auth\LoginScreen.tsx

import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

// 네비게이션 타입 정의
type NavigationProp = {
  navigate: (screen: string) => void;
};

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. 백엔드에 로그인 요청
      const loginResponse = await fetch('http://3.35.27.124:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || '로그인에 실패했습니다.');
      }

      const loginData = await loginResponse.json();
      const { accessToken } = loginData;

      // 2. 받은 토큰으로 사용자 정보 요청
      const userResponse = await fetch('http://3.35.27.124:8080/api/v1/users/me', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (!userResponse.ok) {
        throw new Error('사용자 정보를 가져오는데 실패했습니다.');
      }
      
      const userData = await userResponse.json();
      const userType = userData.role?.toLowerCase() || 'visitor';

      // 3. AuthContext의 login 함수 호출하여 상태 변경
      // 백엔드 ROLE (e.g., RESIDENT)을 프론트엔드 타입 (e.g., resident)으로 변환
      await login(accessToken, userType);

    } catch (e: any) {
      setError(e.message);
      setIsLoading(false);
    }
    // 성공 시에는 isLoading을 false로 바꿀 필요 없음. 화면이 전환되기 때문.
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>로그인</Text>
        
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>로그인</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => Alert.alert("회원가입", "회원가입 기능은 아직 준비 중입니다.")}>
          <Text style={styles.registerText}>계정이 없으신가요? <Text style={styles.registerLink}>회원가입</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  content: { width: '85%', alignItems: 'center' },
  logo: { width: 100, height: 100, marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: { width: '100%', height: 50, backgroundColor: '#F2F2F7', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },
  button: { width: '100%', paddingVertical: 15, borderRadius: 12, backgroundColor: '#2F80ED', justifyContent: 'center', alignItems: 'center', marginVertical: 10 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', marginBottom: 10 },
  registerText: { color: '#828282', marginTop: 20 },
  registerLink: { color: '#2F80ED', fontWeight: 'bold' },
});

export default LoginScreen;
