import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

export default function QASetup() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [qnaList, setQnaList] = useState<{ q: string; a: string }[]>([]);

  const handleAddQnA = () => {
    setQnaList(prev => [...prev, { q: question, a: answer }]);
    setQuestion('');
    setAnswer('');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Q&A 설정</Text>
      <TextInput
        placeholder="질문"
        value={question}
        onChangeText={setQuestion}
        style={{ borderWidth: 1, marginBottom: 8, padding: 6 }}
      />
      <TextInput
        placeholder="답변"
        value={answer}
        onChangeText={setAnswer}
        style={{ borderWidth: 1, marginBottom: 8, padding: 6 }}
      />
      <Button title="추가" onPress={handleAddQnA} />

      <FlatList
        data={qnaList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginTop: 10 }}>
            <Text>Q: {item.q}</Text>
            <Text>A: {item.a}</Text>
          </View>
        )}
      />
    </View>
  );
}