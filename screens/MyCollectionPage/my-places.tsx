import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// 내가 기록한 장소의 타입 정의
type MyPlace = {
  id: string;
  name: string;
  category: string;
  address: string;
  thumbnail: string;
};

// 임시 데이터 (나중에 실제 유저 데이터와 연동)
const DUMMY_MY_PLACES: MyPlace[] = [
  {
    id: 'place1',
    name: '온멜로',
    category: '음식점',
    address: '수원시 팔달구 신풍로63번길 5-1',
    thumbnail: 'https://placehold.co/400x300/FFE4E1/333333?text=Onmelo',
  },
  {
    id: 'place2',
    name: '행궁파티',
    category: '음식점',
    address: '수원시 팔달구 정조로886번길 19',
    thumbnail: 'https://placehold.co/400x300/E1FFD6/333333?text=Party',
  },
  {
    id: 'place3',
    name: '수원시립아이파크미술관',
    category: '문화공간',
    address: '수원시 팔달구 정조로 833',
    thumbnail: 'https://placehold.co/400x300/D6F1FF/333333?text=Museum',
  },
];

export default function MyPlacesScreen() {
  const navigation = useNavigation();

  const renderPlaceItem = ({ item }: { item: MyPlace }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.category} ・ {item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내가 기록한 장소</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <FlatList
        data={DUMMY_MY_PLACES}
        renderItem={renderPlaceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>아직 기록한 장소가 없어요.</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    listContainer: { padding: 16 },
    card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3, overflow: 'hidden' },
    thumbnail: { width: 100, height: 100, backgroundColor: '#F2F2F7', },
    cardContent: { flex: 1, padding: 16, justifyContent: 'center'},
    cardTitle: { fontSize: 16, fontWeight: 'bold' },
    cardSubtitle: { fontSize: 13, color: '#828282', marginTop: 6 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '40%' },
    emptyText: { fontSize: 18, fontWeight: '600', color: '#4F4F4F' },
});
