import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';

export default function GenerateMarketing() {
  const [description, setDescription] = useState('');
  const [generated, setGenerated] = useState('');

  const handleGenerate = () => {
    // TODO: OpenAI API 등 연동
    setGenerated(`감성 문구 예시: ${description}을 특별하게 만들어드립니다.`);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>가게 설명 입력</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="설명을 입력하세요"
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />
      <Button title="AI 문구 생성" onPress={handleGenerate} />
      {generated !== '' && (
        <Text style={{ marginTop: 20 }}>{generated}</Text>
      )}
    </View>
  );
}