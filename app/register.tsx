import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckNickname = async () => {
    if (!username) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }
    // TODO: 백엔드 API 연동
    Alert.alert('알림', `'${username}'은(는) 사용 가능한 닉네임입니다.`);
    setIsNicknameAvailable(true);
  };

  const handleRequestVerification = async () => {
    if (!email) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }
    // TODO: 백엔드 API 연동
    Alert.alert('알림', `인증번호가 ${email}로 발송되었습니다.`);
    setIsVerificationCodeSent(true);
  };

  const handleConfirmVerification = async () => {
    if (!verificationCode) {
        Alert.alert('알림', '인증번호를 입력해주세요.');
        return;
    }
    // TODO: 백엔드 API 연동
    Alert.alert('알림', '이메일 인증이 완료되었습니다.');
    setIsEmailVerified(true);
  }


  const handleRegister = async () => {
    Keyboard.dismiss();

    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }
    if (!isNicknameAvailable) {
      Alert.alert('확인 필요', '닉네임 중복 확인을 완료해주세요.');
      return;
    }
    if (!isEmailVerified) {
        Alert.alert('확인 필요', '이메일 인증을 완료해주세요.');
        return;
    }
    if (password !== confirmPassword) {
      Alert.alert('입력 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://3.35.27.124:8080/api/members/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: username, email, password }),
      });

      if (response.ok) {
        Alert.alert('회원가입 완료', `${username}님, 회원가입이 완료되었습니다. 로그인해주세요.`);
        router.replace('/login');
      } else {
        const errorData = await response.json();
        Alert.alert('회원가입 실패', errorData.message || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('네트워크 오류', '서버에 연결할 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>회원가입</Text>
            <Text style={styles.subtitle}>행:온과 함께할 정보를 입력해주세요.</Text>

            {/* 닉네임 입력 그룹 */}
            <View style={styles.inputGroup}>
                <TextInput
                    style={[styles.input, styles.inputWithButton, isNicknameAvailable && styles.verifiedInput]}
                    placeholder="사용자 이름 (닉네임)"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    editable={!isNicknameAvailable}
                />
                <TouchableOpacity 
                    style={[styles.checkButton, isNicknameAvailable && styles.verifiedButton]} 
                    onPress={handleCheckNickname}
                    disabled={isNicknameAvailable === true}
                >
                    <Text style={styles.checkButtonText}>{isNicknameAvailable ? '확인완료' : '중복확인'}</Text>
                </TouchableOpacity>
            </View>
            
            {/* 이메일 입력 그룹 */}
            <View style={styles.inputGroup}>
                <TextInput
                    style={[styles.input, styles.inputWithButton, isEmailVerified && styles.verifiedInput]}
                    placeholder="이메일 주소"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isVerificationCodeSent}
                />
                <TouchableOpacity 
                    style={[styles.checkButton, isVerificationCodeSent && styles.verifiedButton]} 
                    onPress={handleRequestVerification}
                    disabled={isVerificationCodeSent}
                >
                    <Text style={styles.checkButtonText}>{isVerificationCodeSent ? '재전송' : '인증요청'}</Text>
                </TouchableOpacity>
            </View>
            
            {/* 인증번호 입력 그룹 (인증번호 발송 후 표시) */}
            {isVerificationCodeSent && !isEmailVerified && (
                 <View style={styles.inputGroup}>
                    <TextInput
                        style={[styles.input, styles.inputWithButton]}
                        placeholder="인증번호 6자리"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        keyboardType="number-pad"
                        maxLength={6}
                    />
                    <TouchableOpacity style={styles.checkButton} onPress={handleConfirmVerification}>
                        <Text style={styles.checkButtonText}>인증확인</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* 비밀번호 입력 */}
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="비밀번호"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>가입하기</Text>}
            </TouchableOpacity>

            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>이미 계정이 있으신가요? </Text>
                <Link href="/login" asChild>
                    <TouchableOpacity><Text style={styles.link}>로그인</Text></TouchableOpacity>
                </Link>
            </View>
        </ScrollView>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#828282',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputGroup: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  // ⭐️ [버그 수정] 비밀번호처럼 혼자 있는 입력 필드를 위한 감싸기(wrapper) 스타일 추가
  inputWrapper: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#F2F2F7',
    fontSize: 16,
    // ⭐️ [버그 수정] 아래 flex: 1 속성이 문제의 원인이었습니다. 이 속성을 inputWithButton으로 옮깁니다.
  },
  inputWithButton: {
    flex: 1, // ⭐️ 버튼과 함께 있을 때만 flex: 1을 적용해 공간을 차지하도록 합니다.
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 0,
  },
  checkButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#828282',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  verifiedInput: {
    backgroundColor: '#E0E0E0'
  },
  verifiedButton: {
    backgroundColor: '#BDBDBD'
  },
  button: {
    height: 50,
    backgroundColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#828282',
  },
  link: {
    fontSize: 16,
    color: '#2F80ED',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
