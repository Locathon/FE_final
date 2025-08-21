import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommunityStackParamList } from '../../navigation/CommunityNavigator';

// PostDetailScreen에서 사용했던 Post 타입을 가져와 사용합니다.
// 실제 앱에서는 이 타입을 별도의 types.ts 파일로 분리하여 관리하는 것이 좋습니다.
type Post = {
  id: string;
  title: string;
  content: string;
  // 이미지 타입은 string 배열로 가정합니다.
  images?: string[];
};

// PostDetailScreen의 임시 데이터를 가져와 수정할 데이터를 찾는데 사용합니다.
const DUMMY_POSTS: Post[] = [
  {
    id: '1',
    title: '요즘 행궁동에서 가장 핫한 카페',
    content: '저는 개인적으로 온멜로 추천합니다! 분위기가 정말 좋아요. 특히 디저트 종류가 다양하고 맛있어서 자주 가게 되네요. 여러분의 최애 카페는 어디인가요? 공유해주세요!',
    images: ['https://placehold.co/400x300/CCCCCC/FFFFFF?text=Cafe'],
  },
];

// 네비게이션 및 라우트 타입 정의
type EditPostScreenRouteProp = RouteProp<CommunityStackParamList, 'EditPost'>;

export default function EditPostScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditPostScreenRouteProp>();
  const { postId } = route.params;

  // 제목, 내용, 이미지를 위한 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // 컴포넌트가 마운트될 때 postId를 이용해 기존 게시물 데이터를 불러옵니다.
  useEffect(() => {
    const postToEdit = DUMMY_POSTS.find(p => p.id === postId);
    if (postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setImages(postToEdit.images || []);
    }
  }, [postId]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진을 수정하려면 사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      setImages(result.assets.map(asset => asset.uri));
    }
  };

  const handleSubmit = () => {
    if (title.trim() === '' || content.trim() === '') {
      Alert.alert('알림', '제목과 내용을 모두 입력해주세요.');
      return;
    }
    // 수정된 데이터를 콘솔에 출력 (실제로는 서버로 전송)
    console.log('Updated Post:', { postId, title, content, images });
    Alert.alert('수정 완료', '게시물이 성공적으로 수정되었습니다.');
    navigation.goBack(); // 상세 화면으로 돌아가기
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더: 뒤로가기, 제목, 수정완료 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시물 수정</Text>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>수정 완료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* 제목 입력 필드 추가 */}
        <TextInput
          style={styles.titleInput}
          placeholder="제목"
          value={title}
          onChangeText={setTitle}
        />
        <View style={styles.divider} />
        {/* 내용 입력 필드 */}
        <TextInput
          style={styles.contentInput}
          placeholder="행궁동과 관련된 이야기를 공유해보세요..."
          multiline
          value={content}
          onChangeText={setContent}
        />
        {/* 이미지 미리보기 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.previewImage} />
          ))}
        </ScrollView>
      </ScrollView>

      {/* 툴바 (사진 추가 등) */}
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
    submitButton: { backgroundColor: '#2F80ED', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    submitButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
    titleInput: { padding: 16, fontSize: 18, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 16 },
    contentInput: { padding: 16, fontSize: 16, minHeight: 200, textAlignVertical: 'top' },
    imagePreviewContainer: { paddingLeft: 16, paddingBottom: 16 },
    previewImage: { width: 100, height: 100, borderRadius: 8, marginRight: 8 },
    toolbar: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#E0E0E0', backgroundColor: '#FFF' },
});

