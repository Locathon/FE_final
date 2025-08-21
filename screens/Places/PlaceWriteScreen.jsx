// C:\Users\mnb09\Desktop\Temp\screens\Places\PlaceWriteScreen.jsx

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
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
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const GOOGLE_API_KEY = 'AIzaSyA38Wx1aAoueHqiOsWVlTYSIAvRtO6RW6g';

export default function PlaceWriteScreen({ navigation }) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [pin, setPin] = useState({ latitude: 37.5665, longitude: 127.001 });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('위치 권한 거부', '지도를 사용하려면 위치 권한이 필요합니다.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      if (location?.coords) {
        setPin({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      }
    })();
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진첩 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      if (images.length >= 3) {
        Alert.alert('제한 초과', '사진은 최대 3장까지 업로드할 수 있습니다.');
        return;
      }
      setImages([...images, result.assets[0].uri]);
    }
  };

  const uploadToS3 = async (uri) => {
    try {
      const cleanTitle = title.trim().replace(/\s+/g, '_');
      const filename = `${cleanTitle}/${Date.now()}.jpg`;
      const s3Url = `https://locathonbucket00.s3.amazonaws.com/${filename}`;
      const response = await fetch(uri);
      const blob = await response.blob();
      const uploadRes = await fetch(s3Url, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: blob,
      });
      if (!uploadRes.ok) throw new Error('S3 업로드 실패');
      return s3Url;
    } catch (error) {
      console.error('uploadToS3 error:', error);
      throw error;
    }
  };

  const searchLocationByName = async () => {
    if (!name.trim()) {
      Alert.alert('입력 필요', '장소 이름을 입력해주세요.');
      return;
    }
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(name)}&key=${GOOGLE_API_KEY}`);
      const json = await res.json();
      if (json.status === 'OK' && json.results.length > 0) {
        const location = json.results[0].geometry.location;
        setPin({ latitude: location.lat, longitude: location.lng });
      } else {
        Alert.alert('검색 실패', '입력한 장소를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('오류', '장소 검색 중 문제가 발생했습니다.');
    }
  };

  const handleSavePlace = async () => {
    if (!name.trim() || !title.trim() || !content.trim()) {
      Alert.alert('입력 필요', '장소 이름, 제목, 내용을 모두 입력해주세요.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        Alert.alert('로그인 필요', '장소 등록을 위해 로그인해 주세요.');
        return;
      }
      const imageUrls = await Promise.all(images.map(uploadToS3));
      const placeDto = {
        name: name.trim().replace(/\s+/g, ' '),
        title: title.trim().replace(/\s+/g, ' '),
        content: content.trim(),
        latitude: pin.latitude,
        longitude: pin.longitude,
        imageUrls: imageUrls,
      };
      console.log('보낼 placeDto:', JSON.stringify(placeDto, null, 2));
      const res = await fetch('http://3.35.27.124:8080/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(placeDto),
      });
      const resText = await res.text();
      if (res.ok) {
        Alert.alert('등록 완료', '장소가 성공적으로 등록되었습니다.', [{ text: '확인', onPress: () => navigation.navigate('PlaceList', { refresh: true }) }]);
      } else {
        try {
          const error = JSON.parse(resText);
          Alert.alert('실패', error.message || '등록에 실패했습니다.');
        } catch {
          Alert.alert('실패', resText || '등록에 실패했습니다.');
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert('오류', '서버와 연결할 수 없습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>장소 추천 등록</Text>
        <TouchableOpacity onPress={handleSavePlace}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>장소 이름</Text>
          <TextInput style={styles.input} placeholder="예: 수원 화성" value={name} onChangeText={setName} onSubmitEditing={searchLocationByName} returnKeyType="search" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>제목</Text>
          <TextInput style={styles.input} placeholder="장소를 추천하는 제목을 입력하세요" value={title} onChangeText={setTitle} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>내용</Text>
          <TextInput style={[styles.input, styles.textarea]} placeholder="자세한 설명을 적어주세요" value={content} onChangeText={setContent} multiline textAlignVertical="top" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>지도에서 위치 선택</Text>
          <MapView style={styles.map} region={{ ...pin, latitudeDelta: 0.002, longitudeDelta: 0.002 }} onPress={(e) => setPin(e.nativeEvent.coordinate)}>
            <Marker coordinate={pin} draggable onDragEnd={(e) => setPin(e.nativeEvent.coordinate)} />
          </MapView>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>사진 업로드 (최대 3장)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((uri, idx) => (<Image key={idx} source={{ uri }} style={styles.previewImage} />))}
            {images.length < 3 && (
              <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
                <Ionicons name="camera-outline" size={24} color="#828282" />
                <Text style={{ marginTop: 4 }}>{images.length}/3</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 두 브랜치의 스타일을 병합하여 최종 스타일을 결정합니다.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333333' },
  saveButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  scrollContainer: { padding: 20 },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 16, fontWeight: '600', color: '#333333', marginBottom: 10 },
  input: { backgroundColor: '#F2F2F7', paddingHorizontal: 15, height: 50, borderRadius: 10, fontSize: 16, color: '#000000' },
  textarea: { height: 100, paddingTop: 15, textAlignVertical: 'top' },
  map: { width: '100%', height: 200, borderRadius: 10, marginTop: 8 },
  previewImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10, backgroundColor: '#F9F9F9' },
  photoButton: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#F9F9F9', marginRight: 10 },
});
