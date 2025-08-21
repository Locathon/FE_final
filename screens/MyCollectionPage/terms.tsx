// app/terms.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function TermsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '이용약관' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>이용약관</Text>
        
        <Text style={styles.heading}>제1조 (목적)</Text>
        <Text style={styles.paragraph}>
          본 약관은 [프로젝트명: Locathon 또는 느린행궁] (이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </Text>

        <Text style={styles.heading}>제2조 (용어의 정의)</Text>
        <Text style={styles.paragraph}>
          1. "서비스"라 함은 구현되는 기능과 관계없이 회원이 이용할 수 있는 [프로젝트명] 관련 제반 서비스를 의미합니다. {'\n'}
          2. "회원"이라 함은 서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.
          {/* TODO: 실제 이용약관 내용으로 채워주세요. */}
        </Text>

        <Text style={styles.heading}>제3조 (약관의 명시와 개정)</Text>
        <Text style={styles.paragraph}>
          1. 회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. {'\n'}
          2. 회사는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 "정보통신망법")" 등 관련법을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
          {/* TODO: 실제 이용약관 내용으로 채워주세요. */}
        </Text>
        
        {/* ... (이하 실제 약관 내용 추가) ... */}

        <Text style={styles.effectiveDate}>시행일자: 2025년 06월 05일</Text>
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
    textAlign: 'justify', // 양쪽 정렬
  },
  effectiveDate: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
  },
});
