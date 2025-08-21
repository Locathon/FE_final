// app/guide.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function GuideScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '행궁 사용 설명서' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Ionicons name="book-outline" size={60} color="#007AFF" style={styles.headerIcon} />
        <Text style={styles.title}>느린행궁 사용 가이드</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. 진짜 행궁동 발견하기</Text>
          <Text style={styles.sectionContent}>
            '장소' 탭에서 행궁동의 숨겨진 명소들을 찾아보세요. 사용자들의 생생한 후기와 평점을 확인할 수 있습니다.
            새로운 장소를 발견했다면 직접 등록하여 다른 사람들과 공유할 수도 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. 나만의 코스 만들기</Text>
          <Text style={styles.sectionContent}>
            '코스' 탭에서 다른 사람들이 만든 멋진 행궁동 코스를 따라가거나, 지도 위에서 직접 장소들을 연결하여
            자신만의 특별한 여행 코스를 만들어보세요. 만든 코스는 다른 사용자들과 공유할 수 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. 소상공인과 함께하기</Text>
          <Text style={styles.sectionContent}>
            '소상공인' 탭에서 행궁동의 개성 넘치는 가게들을 만나보세요. 가게 정보, 메뉴, 특별 이벤트 등을 확인할 수 있습니다.
            사장님이라면 직접 가게를 등록하고 홍보 콘텐츠를 만들어보세요.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. 행궁인장이란?</Text>
          <Text style={styles.sectionContent}>
            행궁동의 특정 장소를 방문하거나 활동에 참여하면 '행궁인장'을 받을 수 있습니다.
            다양한 인장을 모아 특별한 경험을 완성해보세요! (추후 업데이트 예정)
          </Text>
        </View>
         <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. 문의사항</Text>
          <Text style={styles.sectionContent}>
            앱 사용 중 궁금한 점이나 불편한 점이 있다면 언제든지 앱 설정 내 '고객 지원' 메뉴를 통해 문의해주세요.
            여러분의 소중한 의견을 기다립니다.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  headerIcon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#007AFF',
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4F4F4F',
  },
});
