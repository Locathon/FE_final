import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const mockData = [
  { question: '영업시간이 어떻게 되나요?', answer: '오전 9시부터 오후 6시까지 운영합니다.' },
  { question: '주차장은 있나요?', answer: '건물 뒤편에 주차장이 마련되어 있습니다.' },
  { question: '예약은 어떻게 하나요?', answer: '전화 또는 방문을 통해 예약이 가능합니다.' },
];

const QAPreviewScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>고객 Q&amp;A</Text>
      {mockData.map((qa, index) => (
        <View key={index} style={styles.qaItem}>
          <Text style={styles.question}>Q. {qa.question}</Text>
          <Text style={styles.answer}>A. {qa.answer}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qaItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
  },
  answer: {
    fontSize: 16,
    marginTop: 5,
    color: '#555',
  },
});

export default QAPreviewScreen;