import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';

type NewPostRouteParams = {
  NewPostScreen: {
    selectedImages?: string[];
    content?: string;
    aiStatus?: 'idle' | 'loading' | 'done';
    aiContent?: string;
  };
};

export default function NewPostScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<NewPostRouteParams, 'NewPostScreen'>>();
  const { selectedImages = [], content: initialContent = '', aiStatus: initialAiStatus = 'idle', aiContent: initialAiContent = '' } =
    (route.params ?? {}) as NewPostRouteParams['NewPostScreen'];
  const [content, setContent] = useState(initialContent);
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'done'>(initialAiStatus);
  const [aiContent, setAiContent] = useState(initialAiContent);

  const handlePhotoSelect = () => {
    navigation.navigate('PhotoPicker', {
      selectedImages,
      content,
      aiStatus,
      aiContent,
    });
  };

  const handlePostSubmit = () => {
    navigation.navigate('BusinessHome', {
      newPost: {
        content: aiStatus === 'done' ? aiContent : content,
        images: selectedImages,
        timestamp: Date.now(), // Optional: for better sorting
      },
      append: true, // Add a flag to indicate append mode
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.navButton}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>새로운 글 쓰기</Text>
        <TouchableOpacity onPress={handlePostSubmit}>
          <Text style={styles.navButton}>완료</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerRow}>
        <View style={styles.avatarPlaceholder} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>000</Text>
          <Text style={styles.subText}>&gt; 오늘의 추천 메뉴</Text>
        </View>
      </View>

      {aiStatus === 'loading' ? (
        <View style={[styles.textArea, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 24 }}>...</Text>
        </View>
      ) : (
        <TextInput
          style={styles.textArea}
          placeholder="오늘의 추천 메뉴를 작성해보세요"
          multiline
          numberOfLines={6}
          value={aiStatus === 'done' ? aiContent : content}
          onChangeText={setContent}
        />
      )}

      <TouchableOpacity
        style={styles.aiInlineButton}
        onPress={() => {
          setAiStatus('loading');
          setTimeout(() => {
            setAiStatus('done');
            setAiContent('오늘의 추천 메뉴는 여름 한정 망고 요거트입니다!');
          }, 2000);
        }}
      >
        <Text style={styles.aiButtonText}>
          {aiStatus === 'idle' && 'AI 문구 변환'}
          {aiStatus === 'loading' && '변환중...'}
          {aiStatus === 'done' && '변환됨'}
        </Text>
      </TouchableOpacity>

      <View style={styles.photoPreviewRow}>
        {[...selectedImages, ...Array(Math.max(3 - selectedImages.length, 0)).fill(null)].map((uri, index) => (
          uri ? (
            <Image
              key={`img-${index}`}
              source={{ uri }}
              style={styles.photoPlaceholder}
            />
          ) : (
            <TouchableOpacity
              key={`empty-${index}`}
              style={styles.photoPlaceholder}
              onPress={handlePhotoSelect}
            >
              <Text style={styles.plusSign}>＋</Text>
            </TouchableOpacity>
          )
        ))}
      </View>
      <Text style={{ fontSize: 12, color: '#666', marginTop: 8, marginBottom: 12 }}>
        사진을 최소 1장 이상 등록해주세요.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    marginBottom: 8,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  photoButton: {
    backgroundColor: '#ff9800',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  photoButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  submitButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 6,
  },
  submitButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginRight: 12,
    marginBottom: 18,
    marginTop: 12, // Added to align with userInfo
  },
  userInfo: { flexDirection: 'column' },
  username: { fontWeight: 'bold', fontSize: 16 },
  subText: { color: '#888', fontSize: 12 },
  aiButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  aiButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  aiInlineButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
    marginTop: -4,
  },
  photoPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8, // Optional: if using React Native >= 0.71
  },
  photoPlaceholder: {
    width: 100, // Increased from 80
    height: 100, // Increased from 80
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 8, // Add right margin to create consistent spacing
    marginBottom: 8,
  },
  plusSign: { fontSize: 24, color: '#999' },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navButton: {
    color: '#007aff',
    fontSize: 16,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  aiResultBox: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  aiResultText: {
    fontSize: 14,
    color: '#333',
  },
});