// Add above component definition
interface AnswerEditScreenRouteParams {
  item: any;
  onSubmit: (answer: string) => void;
}

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const AnswerEditScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item, onSubmit } = route.params as AnswerEditScreenRouteParams;
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (!answer.trim()) {
      Alert.alert('오류', '답변을 작성해주세요.');
      return;
    }
    onSubmit(answer);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{item.question}</Text>
      <TextInput
        style={styles.input}
        value={answer}
        onChangeText={setAnswer}
        placeholder="답변을 입력하세요"
        multiline
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>답변 제출</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AnswerEditScreen;
