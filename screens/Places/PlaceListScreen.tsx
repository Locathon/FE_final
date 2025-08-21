// C:\Users\mnb09\Desktop\Temp\screens\Places\PlaceListScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Place = {
  id: string;
  name: string;
  description: string;
  thumbnail: ImageSourcePropType | string;
};

type PlaceStackParamList = {
  PlaceWrite: undefined;
  PlaceDetail: { placeId: string };
  PlaceSearch: undefined;
};

type PlaceListNavigationProp = NativeStackNavigationProp<PlaceStackParamList>;

const DUMMY_PICK_PLACES: Place[] = [
  {
    id: 'd1',
    name: '행궁의 숨은 명소',
    description: '행궁동 골목 속 카페거리',
    thumbnail: require('../../assets/images/mural_village.jpg'),
  },
  {
    id: 'd2',
    name: '전통과 현대의 만남',
    description: '전통 찻집과 모던 갤러리',
    thumbnail: require('../../assets/images/flying_suwon.jpg'),
  },
  {
    id: 'd3',
    name: '행궁 속 힐링 산책길',
    description: '조용한 산책로와 벤치',
    thumbnail: require('../../assets/images/chicken_street.jpg'),
  },
];

export default function PlaceListScreen() {
  const navigation = useNavigation<PlaceListNavigationProp>();
  const [places, setPlaces] = useState<Place[]>([]);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('jwt')
      .then(token => setJwtToken(token))
      .catch(err => console.error('JWT 토큰 불러오기 실패:', err));
  }, []);

  useEffect(() => {
    if (!jwtToken) return;

    axios
      .get('http://3.35.27.124:8080/places', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then(res => {
        // 두 브랜치의 안정적인 데이터 처리 로직을 결합
        const placesFromApi = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        const apiPlaces: Place[] = placesFromApi.map((place: any) => ({
          id: place.id.toString(),
          name: place.name ?? '이름 없음',
          description: place.title ?? '',
          thumbnail:
            place.imageUrls && place.imageUrls.length > 0 && place.imageUrls[0]
              ? { uri: place.imageUrls[0] }
              : require('../../assets/images/flying_suwon.jpg'),
        }));
        setPlaces(apiPlaces);
      })
      .catch(err => {
        console.error('장소 불러오기 실패:', err);
      });
  }, [jwtToken]);

  const renderPlaceItem = ({ item }: { item: Place }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PlaceDetail', { placeId: item.id })}
    >
      <Image
        source={typeof item.thumbnail === 'string' ? { uri: item.thumbnail } : item.thumbnail}
        style={styles.thumbnail}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPickItem = (item: Place) => (
    <TouchableOpacity key={item.id} style={styles.pickCard} activeOpacity={0.8}>
      <Image
        source={typeof item.thumbnail === 'string' ? { uri: item.thumbnail } : item.thumbnail}
        style={styles.pickImage}
      />
      <TouchableOpacity
        style={styles.heartIcon}
        activeOpacity={0.7}
        onPress={() => console.log(`하트 클릭: ${item.id}`)}
      >
        <Ionicons name="heart-outline" size={26} color="#ff3b30" />
      </TouchableOpacity>
      <Text style={styles.pickTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>장소</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('PlaceSearch')} activeOpacity={0.7}>
            <Ionicons name="search-outline" size={24} color="#333" style={styles.iconSpacing} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PlaceWrite')} activeOpacity={0.7}>
            <Ionicons name="add-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.pickSection}>
        <Text style={styles.pickHeader}>오늘의 행궁 PICK</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DUMMY_PICK_PLACES}
          renderItem={({ item }) => renderPickItem(item)}
          keyExtractor={item => item.id}
        />
      </View>

      <View style={styles.promotionBanner}>
        <Text style={styles.promotionText}>내 가게 홍보물</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={places}
        renderItem={renderPlaceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>아직 등록된 장소가 없어요.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// main 브랜치의 개선된 스타일과 feature 브랜치의 스타일을 병합합니다.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eeeeee',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
    // feature 브랜치의 marginLeft를 적용하여 중앙 정렬을 보정
    marginLeft: 60, 
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: 16,
  },
  pickSection: {
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  pickHeader: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 12,
    color: '#1c1c1e',
  },
  pickCard: {
    width: 160,
    marginLeft: 16,
    marginRight: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  pickImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 4,
    zIndex: 10,
  },
  pickTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: 12,
    color: '#1c1c1e',
  },
  promotionBanner: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eeeeee',
  },
  promotionText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 100,
    backgroundColor: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1c1c1e',
  },
  cardDescription: {
    fontSize: 14,
    color: '#1c1c1e',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '40%',
  },
  emptyText: {
    fontSize: 15,
    color: '#1c1c1e',
  },
});
