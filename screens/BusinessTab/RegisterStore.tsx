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
  View,
} from 'react-native';

// ⭐️ 입력 필드 컴포넌트의 props 타입을 정의합니다.
type FormInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
};

// 입력 필드를 위한 공통 컴포넌트
const FormInput = ({ label, placeholder, value, onChangeText, multiline = false }: FormInputProps) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      placeholderTextColor="#BDBDBD"
    />
  </View>
);

// ⭐️ 카테고리 선택 컴포넌트의 props 타입을 정의합니다.
type CategorySelectorProps = {
    categories: string[];
    selectedCategory: string;
    onSelect: (category: string) => void;
}

// 카테고리 선택을 위한 공통 컴포넌트
const CategorySelector = ({ categories, selectedCategory, onSelect }: CategorySelectorProps) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>카테고리</Text>
        <View style={styles.categoryContainer}>
            {categories.map((category) => (
                <TouchableOpacity
                    key={category}
                    style={[
                        styles.categoryChip,
                        selectedCategory === category && styles.categoryChipSelected,
                    ]}
                    onPress={() => onSelect(category)}
                >
                    <Text
                        style={[
                            styles.categoryChipText,
                            selectedCategory === category && styles.categoryChipTextSelected,
                        ]}
                    >
                        {category}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);


export default function RegisterStoreScreen() {
  const navigation = useNavigation();
  // 입력 폼 상태 관리
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  
  const CATEGORIES = ['카페', '음식점', '소품샵', '공방', '문화공간', '기타'];

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '가게 사진을 등록하려면 사진첩 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleRegister = () => {
    if (!storeName || !selectedCategory || !address) {
      Alert.alert('필수 정보 누락', '가게 이름, 카테고리, 주소는 반드시 입력해야 합니다.');
      return;
    }
    // TODO: 실제 서버로 등록 정보 전송
    console.log({ storeName, selectedCategory, address, introduction, images });
    Alert.alert('등록 요청 완료', '가게 등록 요청이 접수되었습니다. 검토 후 반영될 예정입니다.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>가게 등록하기</Text>
        <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
            <Text style={styles.submitButtonText}>완료</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>가게 정보를 입력해주세요</Text>
        
        <FormInput label="가게 이름" placeholder="예) 느린행궁 카페" value={storeName} onChangeText={setStoreName} />
        <CategorySelector categories={CATEGORIES} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
        <FormInput label="주소" placeholder="가게의 정확한 주소를 입력해주세요" value={address} onChangeText={setAddress} />
        <FormInput label="가게 한 줄 소개 (선택)" placeholder="가게의 특징을 잘 나타내는 문구를 적어주세요" value={introduction} onChangeText={setIntroduction} multiline />

        <View style={styles.inputGroup}>
            <Text style={styles.label}>대표 사진 (선택)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((uri, index) => (
                    <Image key={index} source={{ uri }} style={styles.previewImage}/>
                ))}
                {images.length < 5 && (
                  <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
                      <Ionicons name="camera" size={24} color="#828282" />
                      <Text style={styles.photoButtonText}>{images.length}/5</Text>
                  </TouchableOpacity>
                )}
            </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  submitButton: { backgroundColor: '#2F80ED', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  submitButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 40, },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 20, },
  inputGroup: { marginBottom: 24, },
  label: { fontSize: 16, fontWeight: '600', color: '#4F4F4F', marginBottom: 10, },
  input: { backgroundColor: '#F2F2F7', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#333', },
  multilineInput: { height: 100, textAlignVertical: 'top', },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', },
  categoryChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F2F2F7', marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E0E0E0' },
  categoryChipSelected: { backgroundColor: '#D6E6FF', borderColor: '#2F80ED', },
  categoryChipText: { color: '#4F4F4F', fontWeight: '500', },
  categoryChipTextSelected: { color: '#1A67D2', fontWeight: 'bold', },
  photoButton: { width: 80, height: 80, backgroundColor: '#F2F2F7', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', },
  photoButtonText: { fontSize: 12, color: '#828282', marginTop: 4, },
  previewImage: { width: 80, height: 80, borderRadius: 8, marginRight: 8, },
});
