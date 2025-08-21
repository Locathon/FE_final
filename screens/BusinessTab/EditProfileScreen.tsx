import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import * as ImagePicker from 'expo-image-picker';

type EditProfileParams = {
  name?: string;
  description?: string;
  tag?: string;
  hours?: string;
  location?: string;
  phone?: string;
  startHour?: string;
  endHour?: string;
  holidays?: string[];
  website?: string;
  detailLocation?: string;
  profileImage?: string; // ✅ 추가
  menuImages?: (string | null)[]; // ✅ 추가
};

export default function EditProfileScreen() {
  function stripTags(html: string) {
    return html.replace(/<\/?[^>]+(>|$)/g, '');
  }

  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: EditProfileParams }, 'params'>>();
  const params = route.params || {};
  const { width } = useWindowDimensions();
  // --------------------
  // 🧠 상태 관리 (입력값 + AI 상태)
  // --------------------
  const [name, setName] = useState(params.name || '행운');
  const [description, setDescription] = useState(stripTags(params.description || '수제 디저트와 브런치를 제공하는 따뜻한 공간입니다.'));
  const [category, setCategory] = useState(params.tag || '디저트카페');
  const [hours, setHours] = useState(params.hours || '매일 10:00 - 21:00');
  const [location, setLocation] = useState(params.location || '');

  const [phone, setPhone] = useState(params.phone || '');
  const [startHour, setStartHour] = useState(params.startHour || '');
  const [endHour, setEndHour] = useState(params.endHour || '');
  const [holidays, setHolidays] = useState<string[]>(params.holidays || []);
  const [website, setWebsite] = useState(params.website || '');
  const [detailLocation, setDetailLocation] = useState('');

  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [aiResult, setAiResult] = useState('');

  const [loadingDots, setLoadingDots] = useState('');

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [menuImages, setMenuImages] = useState<(string | null)[]>([null, null, null]);
  // Restore previously saved images from params on initial render
  useEffect(() => {
    if (params.profileImage) {
      setProfileImage(params.profileImage);
    }
    if (params.menuImages && Array.isArray(params.menuImages)) {
      setMenuImages(params.menuImages);
    }
  }, []);

  useEffect(() => {
    if (aiStatus === 'loading') {
      const interval = setInterval(() => {
        setLoadingDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [aiStatus]);

  const pickImage = async (index?: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (typeof index === 'number') {
        const newMenuImages = [...menuImages];
        newMenuImages[index] = result.assets[0].uri;
        setMenuImages(newMenuImages);
      } else {
        setProfileImage(result.assets[0].uri);
      }
    }
  };

  // --------------------
  // 📱 화면 렌더링
  // --------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.headerTitle, { alignSelf: 'center' }]}>스토어 편집</Text>

      <Text style={styles.label}>스토어 대표 사진</Text>
      <TouchableOpacity style={styles.imageUploadBox} onPress={() => pickImage()}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.imagePlaceholder} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </TouchableOpacity>

      <Text style={styles.label}>스토어 이름 *</Text>
      <TextInput
        style={styles.input}
        placeholder="예) 레몬트리"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>소개 *</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {aiStatus === 'loading' ? (
          <TextInput
            style={[styles.input, { flex: 1, textAlign: 'center', fontSize: 20 }]}
            editable={false}
            value={loadingDots}
          />
        ) : (
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder=""
            placeholderTextColor="#999"
            multiline
            value={description}
            onChangeText={setDescription}
          />
        )}
        <TouchableOpacity
          style={styles.aiInlineButton}
          onPress={async () => {
            setAiStatus('loading');
            setAiResult('');
            try {
              const response = await fetch('http://3.35.27.124:8080/merchant/style-transform', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  originalText: description,
                  tone: '친근하게',
                }),
              });

              if (!response.ok) throw new Error('AI 변환 요청 실패');

              const data = await response.json();
              setAiResult(data.transformed || '');
              setDescription(stripTags(data.transformed || ''));
              setAiStatus('done');
            } catch (error) {
              console.error('AI 변환 중 오류 발생:', error);
              setAiResult('AI 변환 중 오류가 발생했습니다.');
              setAiStatus('idle');
            }
          }}
        >
          <Text style={styles.aiInlineText}>
            {aiStatus === 'idle' && 'AI 문장 변환'}
            {aiStatus === 'loading' && '변환 중...'}
            {aiStatus === 'done' && '변환됨'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>카테고리 *</Text>
      <View style={styles.categoryRow}>
        {['패션','뷰티','카페','베이커리','음식점','술집','편의점','소품샵','체험','공연','주유소','주차장'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryButton, category === cat && { backgroundColor: '#286FFD' }]}
            onPress={() => setCategory(cat)}
          >
            <Text style={{ color: category === cat ? 'white' : 'black' }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>전화번호 *</Text>
      <TextInput
        style={styles.input}
        placeholder="예) 031-0000-0000"
        placeholderTextColor="#999"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>영업시간 *</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="시작 (예: 10:00)"
          placeholderTextColor="#999"
          value={startHour}
          onChangeText={setStartHour}
        />
        <Text style={{ alignSelf: 'center' }}> ~ </Text>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="종료 (예: 22:00)"
          placeholderTextColor="#999"
          value={endHour}
          onChangeText={setEndHour}
        />
      </View>

      <Text style={styles.label}>휴무일 *</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'nowrap', marginBottom: 8 }}>
        {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.categoryButton,
              {
                flex: 1,
                marginRight: day !== '일' ? 8 : 0,
                backgroundColor: holidays.includes(day) ? '#286FFD' : '#f1f1f1',
              },
            ]}
            onPress={() => {
              setHolidays((prev) =>
                prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
              );
            }}
          >
            <Text style={{ color: holidays.includes(day) ? '#fff' : '#000' }}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>주소 *</Text>
      <TextInput
        style={styles.input}
        placeholder="건물, 지번 또는 도로명 검색"
        placeholderTextColor="#999"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="상세 주소를 입력하세요"
        placeholderTextColor="#999"
        value={detailLocation}
        onChangeText={setDetailLocation}
      />

      <Text style={styles.label}>웹사이트</Text>
      <TextInput
        style={styles.input}
        placeholder="예) https://kr.pinterest.com/pin"
        placeholderTextColor="#999"
        value={website}
        onChangeText={setWebsite}
      />

      <Text style={styles.label}>메뉴</Text>
      {[1, 2, 3].map((_, idx) => (
        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <TouchableOpacity onPress={() => pickImage(idx)}>
            {menuImages[idx] ? (
              <Image source={{ uri: menuImages[idx]! }} style={styles.imagePlaceholder} />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              placeholder="메뉴 이름"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="가격"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      ))}
      <TouchableOpacity style={[styles.aiButton, { alignSelf: 'center' }]}>
        <Text>메뉴 추가하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          navigation.navigate('BusinessHome', {
            name,
            description,
            tag: category,
            phone,
            startHour,
            endHour,
            holidays,
            location,
            website,
            detailLocation,
            profileImage,
            menuImages,
          });
        }}
      >
        <Text style={styles.submitButtonText}>저장</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  headerText: { fontSize: 16, color: '#007AFF' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  label: { marginTop: 12, marginBottom: 4, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12 },
  // profileRow, storeName, storeCategory: removed for new layout
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  profileImageBox: {
    justifyContent: 'flex-start',
  },
  profileImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ddd',
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 4,
  },
  descriptionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
    gap: 8,
  },
  aiButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginLeft: 8,
  },
  aiButtonText: { fontSize: 12 },
  aiInlineButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginLeft: 8,
  },
  aiInlineText: {
    fontSize: 12,
  },
  descriptionInput: {
    textAlignVertical: 'top',
    minHeight: 100,
    maxHeight: 300,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryButton: {
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    height: 36,
  },
  aiResultBox: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  aiResultText: {
    fontSize: 13,
    color: '#333',
  },
  imageUploadBox: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#e8ecef',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#111',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
