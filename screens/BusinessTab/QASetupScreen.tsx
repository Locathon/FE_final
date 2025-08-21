// C:\Users\mnb09\Desktop\Temp\screens\Business\QASetupScreen.tsx

import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type QA = { question: string; answer: string; expanded: boolean };

const initialQAs: QA[] = [
  { question: '오늘 영업하나요?', answer: '네, 오늘 정상 영업합니다!', expanded: false },
  { question: '주차장 있나요?', answer: '네, 건물 앞 주차장 이용 가능합니다.', expanded: false },
  { question: '포장도 되나요?', answer: '네, 모든 메뉴 포장 가능합니다 :)', expanded: false },
];

export default function QASetupScreen() {
  const navigation = useNavigation<any>();
  const [qaList, setQaList] = useState<QA[]>(initialQAs);

  // 이 화면은 더 이상 setParams를 사용하지 않습니다.
  // 저장 버튼을 통해 명시적으로 데이터를 전달합니다.

  const handleQuestionChange = (text: string, index: number) => {
    const updatedList = [...qaList];
    updatedList[index].question = text;
    setQaList(updatedList);
  };

  const handleAnswerChange = (text: string, index: number) => {
    const updatedList = [...qaList];
    updatedList[index].answer = text;
    setQaList(updatedList);
  };

  const toggleExpand = (index: number) => {
    const updatedList = [...qaList];
    updatedList[index].expanded = !updatedList[index].expanded;
    setQaList(updatedList);
  };
  
  const addQA = () => {
    setQaList([...qaList, { question: '', answer: '', expanded: true }]);
  };

  const deleteQA = (index: number) => {
    const updatedList = qaList.filter((_, i) => i !== index);
    setQaList(updatedList);
  }

  // [핵심 수정] 저장하고 돌아가는 함수
  const handleSaveChanges = () => {
    // expanded 속성을 제외한 순수 데이터만 전달합니다.
    const simplifiedQas = qaList.map(({ question, answer }) => ({ question, answer }));
    // 'BusinessHome' 경로로 파라미터를 전달하며 돌아갑니다.
    navigation.navigate('BusinessHome', { qas: simplifiedQas });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Text style={styles.header}>Q&A 설정</Text>

        <FlatList
          data={qaList}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.qaItem}>
              <TouchableOpacity
                onPress={() => toggleExpand(index)}
                style={styles.questionContainer}
              >
                <TextInput
                    style={styles.questionInput}
                    value={item.question}
                    onChangeText={(text) => handleQuestionChange(text, index)}
                    placeholder="질문을 입력하세요"
                />
                <Text style={styles.arrow}>
                  {item.expanded ? '˄' : '˅'}
                </Text>
              </TouchableOpacity>

              {item.expanded && (
                <View style={styles.answerContainer}>
                  <TextInput
                    style={styles.answerInput}
                    value={item.answer}
                    onChangeText={(text) => handleAnswerChange(text, index)}
                    placeholder="답변을 입력해주세요."
                    multiline
                  />
                  <TouchableOpacity onPress={() => deleteQA(index)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          ListFooterComponent={
            <TouchableOpacity style={styles.addButton} onPress={addQA}>
              <Text style={styles.addButtonText}>+ 질문 추가하기</Text>
            </TouchableOpacity>
          }
          contentContainerStyle={{ paddingBottom: 150 }}
        />
        
        {/* [핵심 수정] 하단에 고정된 저장 버튼 */}
        <View style={styles.bottomButtonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>저장하고 돌아가기</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, paddingHorizontal: 20, paddingTop: 16 },
  qaItem: { borderBottomWidth: 1, borderBottomColor: '#F2F2F7', marginBottom: 12, paddingHorizontal: 20, },
  questionContainer: { paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  questionInput: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#1C1C1E' },
  arrow: { fontSize: 20, color: '#8E8E93', marginLeft: 10 },
  answerContainer: { backgroundColor: '#F7F7F7', borderRadius: 12, padding: 16, marginBottom: 16 },
  answerInput: { fontSize: 15, color: '#3C3C43', minHeight: 60, textAlignVertical: 'top' },
  deleteButton: { alignSelf: 'flex-end', marginTop: 8, paddingHorizontal: 12, paddingVertical: 6 },
  deleteButtonText: { color: '#FF3B30', fontSize: 14 },
  addButton: {
    backgroundColor: '#1C1C1E',      // 검정색 배경
    paddingHorizontal: 24,           // 좌우 패딩 넉넉히
    paddingVertical: 12,             // 상하 패딩 조정
    borderRadius: 999,               // 완전한 pill 형태
    alignItems: 'center',
    alignSelf: 'center',             // 가운데 정렬
    marginVertical: 16,
  },

  addButtonText: {
    color: '#FFFFFF',                // 흰색 텍스트
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomButtonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F2F2F2' },
  saveButton: { backgroundColor: '#48C8FF', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
