import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function EditQnAScreen() {
  const navigation = useNavigation<any>();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSave = () => {
    // TODO: Save logic here
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Q&amp;A 편집</Text>

      <Text style={styles.label}>질문</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        placeholder="질문을 입력하세요"
      />

      <Text style={styles.label}>답변</Text>
      <TextInput
        style={styles.input}
        value={answer}
        onChangeText={setAnswer}
        placeholder="답변을 입력하세요"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: '#ccc', marginTop: 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.saveButtonText, { color: '#333' }]}>취소</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 4, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#48C8FF',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});