import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type BusinessStackParamList = {
  GenerateMarketing: undefined;
};

const sampleMarketingTexts = [
  '우리 가게만의 특별한 혜택! 오늘 방문하시면 커피 한 잔 무료!',
  '신선한 재료로 매일 만드는 건강한 한 끼, 지금 주문하세요!',
  '이번 주말, 친구와 함께 오시면 10% 할인 이벤트 진행 중!',
];

const MarketingDetailScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<BusinessStackParamList>>();

  const handleCopy = (text: string) => {
    // 클립보드 복사 기능 (추후 Clipboard API 연동 필요)
    Alert.alert('복사됨', '문구가 클립보드에 복사되었습니다.');
  };

  const handleEdit = () => {
    // 편집 화면으로 이동 (필요시 추가 구현)
    navigation.navigate('GenerateMarketing');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>AI 마케팅 문구</Text>

      <ScrollView style={styles.scrollContainer}>
        {sampleMarketingTexts.map((text, index) => (
          <View key={index} style={styles.textContainer}>
            <Text style={styles.text}>{text}</Text>
            <TouchableOpacity onPress={() => handleCopy(text)} style={styles.copyButton}>
              <Ionicons name="copy-outline" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
        <Text style={styles.editButtonText}>문구 편집하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MarketingDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  textContainer: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  copyButton: {
    marginLeft: 10,
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#2e86de',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});