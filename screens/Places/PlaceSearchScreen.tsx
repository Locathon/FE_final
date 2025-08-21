import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Place = {
  id: string;
  name: string;
  description: string;
  imageUrls?: string[]; // 이미지 URL 배열
};

type PlaceStackParamList = {
  PlaceDetail: { placeId: string };
};

type PlaceSearchNavigationProp = NativeStackNavigationProp<PlaceStackParamList>;

export default function PlaceSearchScreen() {
  const navigation = useNavigation<PlaceSearchNavigationProp>();
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // AsyncStorage에서 JWT 토큰 불러오기
  useEffect(() => {
    AsyncStorage.getItem('jwt')
      .then(token => setJwtToken(token))
      .catch(err => console.error('JWT 토큰 불러오기 실패:', err));
  }, []);

  // 검색어가 바뀔 때마다 500ms 디바운스 후 장소 불러오기
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchPlaces(query);
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query, jwtToken]); // jwtToken도 의존성에 추가

  // 화면 처음 로드 시 빈 쿼리로 장소 불러오기
  useEffect(() => {
    if (jwtToken) {
      fetchPlaces('');
    }
  }, [jwtToken]);

  const fetchPlaces = async (keyword: string) => {
    if (!jwtToken) {
      console.warn('JWT 토큰 없음, API 요청 불가');
      setPlaces([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const url = keyword.trim()
        ? `http://3.35.27.124:8080/places?keyword=${encodeURIComponent(keyword.trim())}`
        : `http://3.35.27.124:8080/places`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log('서버 응답:', response.data);

      const placesArray = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];

      const transformedPlaces: Place[] = placesArray.map((place: any) => ({
        id: place.id?.toString() ?? Math.random().toString(),
        name: place.name ?? '이름 없음',
        description: place.description ?? place.title ?? '',
        imageUrls: place.imageUrls && Array.isArray(place.imageUrls) ? place.imageUrls : [],
      }));

      setPlaces(transformedPlaces);
    } catch (error) {
      console.error('장소 데이터 불러오기 실패:', error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const renderPlaceItem = ({ item }: { item: Place }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('PlaceDetail', { placeId: item.id })}
    >
      <Image
        source={
          item.imageUrls && item.imageUrls.length > 0
            ? { uri: item.imageUrls[0] }
            : require('../../assets/images/flying_suwon.jpg')
        }
        style={styles.thumbnail}
      />
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#828282" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="장소나 카테고리를 검색해보세요"
            value={query}
            onChangeText={setQuery}
            autoFocus
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#666" />
        </View>
      ) : (
        <FlatList
          data={places}
          renderItem={renderPlaceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={places.length === 0 ? styles.emptyContainer : styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyMessageContainer}>
              <Text style={styles.emptyText}>검색 결과가 없어요.</Text>
              <Text style={styles.emptySubtext}>다른 키워드로 검색해보세요.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    marginLeft: 12,
  },
  searchIcon: { marginHorizontal: 10 },
  searchInput: { flex: 1, height: 40, fontSize: 16 },
  listContainer: { padding: 16 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  emptyMessageContainer: { justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#4F4F4F' },
  emptySubtext: { fontSize: 14, color: '#828282', marginTop: 8 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  resultItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  resultTextContainer: { flex: 1, marginLeft: 12 },
  resultName: { fontSize: 16, fontWeight: '600' },
  resultDescription: { fontSize: 14, color: '#666', marginTop: 4 },
});
