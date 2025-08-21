import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

interface QAItem {
  id: string;
  question: string;
  answer: string;
}

export default function AutoQnAScreen() {
  const [qnaList, setQnaList] = useState<QAItem[]>([
    { id: '1', question: '영업시간이 어떻게 되나요?', answer: '매일 오전 10시부터 오후 9시까지 운영합니다.' },
    { id: '2', question: '반려동물 동반 가능한가요?', answer: '' },
  ]);

  const [newQuestion, setNewQuestion] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<QAItem | null>(null);

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;

    const newQnA: QAItem = {
      id: Date.now().toString(),
      question: newQuestion,
      answer: '자동 생성된 답변입니다.', // Placeholder
    };

    setQnaList(prev => [newQnA, ...prev]);
    setNewQuestion('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={qnaList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.qnaBox} onPress={() => setSelectedQuestion(item)}>
            <Text style={styles.question}>Q. {item.question}</Text>
          </TouchableOpacity>
        )}
        style={styles.qnaList}
        contentContainerStyle={{ paddingBottom: 20 }}
        inverted
      />
      {selectedQuestion && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="답변을 작성하세요"
            value={selectedQuestion.answer}
            onChangeText={(text) =>
              setQnaList(prev =>
                prev.map(q => q.id === selectedQuestion.id ? { ...q, answer: text } : q)
              )
            }
            keyboardType="default"
            multiline={true}
          />
        </View>
      )}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="질문을 입력하세요"
          value={newQuestion}
          onChangeText={setNewQuestion}
          keyboardType="default"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  qnaList: { flex: 1 },
  qnaBox: { marginBottom: 12, padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  question: { fontWeight: 'bold', marginBottom: 4 },
  answer: { color: '#555' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12 },
  addButton: { marginLeft: 8, backgroundColor: '#2196f3', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 6 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
});