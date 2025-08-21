// app/privacy.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '개인정보 처리방침' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>개인정보 처리방침</Text>

        <Text style={styles.paragraph}>
          [프로젝트명: Locathon 또는 느린행궁](이하 "회사")는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
        </Text>

        <Text style={styles.heading}>제1조 (개인정보의 처리 목적)</Text>
        <Text style={styles.paragraph}>
          회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          {'\n'}1. 홈페이지 회원가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지 등
          {/* TODO: 실제 개인정보 처리방침 내용으로 채워주세요. */}
        </Text>

        <Text style={styles.heading}>제2조 (처리하는 개인정보의 항목)</Text>
        <Text style={styles.paragraph}>
          회사는 다음의 개인정보 항목을 처리하고 있습니다.
          {'\n'}1. 필수항목 : 이메일, 비밀번호, 닉네임
          {'\n'}2. 선택항목 : 프로필 사진
          {/* TODO: 실제 개인정보 처리방침 내용으로 채워주세요. */}
        </Text>

        {/* ... (이하 실제 개인정보 처리방침 내용 추가) ... */}

        <Text style={styles.effectiveDate}>본 방침은 2025년 06월 05일부터 시행됩니다.</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
    textAlign: 'justify',
  },
  effectiveDate: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
  },
});
