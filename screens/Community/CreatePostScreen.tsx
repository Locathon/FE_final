import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Post, posts } from '../../data/communityData';
import { currentUser } from '../../data/userData';

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<any[]>([]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진을 추가하려면 사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      setImages(result.assets.map(asset => ({ uri: asset.uri })));
    }
  };

  const handleSubmit = () => {
    if (title.trim() === '' || content.trim() === '') {
      Alert.alert('알림', '제목과 내용을 모두 입력해주세요.');
      return;
    }
    
    const newPost: Post = {
      id: `post${Date.now()}`,
      userId: currentUser.id,
      title,
      content,
      images,
      category: '잡담',
      timestamp: '방금 전',
      likes: 0,
      iLiked: false,
      commentsCount: 0,
      comments: [],
      distance: 0.1, 
      createdAt: new Date(),
    };

    posts.unshift(newPost);
    
    Alert.alert('등록 완료', '게시물이 성공적으로 등록되었습니다.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>글쓰기</Text>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>등록</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <TextInput
          style={styles.titleInput}
          placeholder="제목"
          value={title}
          onChangeText={setTitle}
        />
        <View style={styles.divider} />
        <TextInput
          style={styles.contentInput}
          placeholder="행궁동과 관련된 이야기를 공유해보세요..."
          multiline
          value={content}
          onChangeText={setContent}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
          {images.map((img, index) => (
             <Image key={index} source={img} style={styles.previewImage} />
          ))}
        </ScrollView>
      </ScrollView>

      <View style={styles.toolbar}>
        <TouchableOpacity onPress={handlePickImage}>
          <Ionicons name="image-outline" size={28} color="#828282" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    submitButton: { backgroundColor: '#48C8FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    submitButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
    titleInput: { padding: 16, fontSize: 18, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 16 },
    contentInput: { padding: 16, fontSize: 16, minHeight: 200, textAlignVertical: 'top' },
    imagePreviewContainer: { paddingLeft: 16, paddingBottom: 16 },
    previewImage: { width: 100, height: 100, borderRadius: 8, marginRight: 8 },
    toolbar: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#E0E0E0', backgroundColor: '#FFF' },
});
