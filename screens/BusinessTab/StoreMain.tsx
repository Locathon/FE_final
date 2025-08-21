import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type BusinessStackParamList = {
  StoreMain: undefined;
  BusinessHome_user: undefined;
  Notification: undefined;
  AutoQnAScreen: undefined;
  NewPostScreen: undefined;
  EditProfileScreen: undefined;
  QASetup: undefined;
  QAPreview: undefined;
  GenerateMarketing: undefined;
  MarketingDetail: undefined;
  PhotoPicker: undefined;
  PostDetail: undefined;
  RegisterStore: undefined;
  EditStore: undefined;
};

const STORE_DATA = [
  {
    id: '1',
    rank: 1,
    name: '정지영 커피 로스터즈',
    address: '경기도 수원시 팔달구 신풍동 신풍로 42',
    rating: 5.0,
    reviews: 34,
    likes: '1.1K',
    rankChange: -1,
    images: [
      require('../../assets/images/caffe/caffe01.jpg'),
      require('../../assets/images/desserts/dessert_4.jpg'),
      require('../../assets/images/caffe/caffe02.jpg'),
      require('../../assets/images/cafe.png'),
    ],
  },
  {
    id: '2',
    rank: 2,
    name: '행궁 디저트 연구소',
    address: '경기도 수원시 행궁동 238 - 234',
    rating: 5.0,
    reviews: 34,
    likes: '1.1K',
    rankChange: 1,
    images: [
      require('../../assets/images/desserts/cafe_profile.jpg'),
      require('../../assets/images/desserts/dessert_1.jpg'),
      require('../../assets/images/desserts/dessert_2.jpg'),
      require('../../assets/images/desserts/dessert_3.jpg'),
    ],
  },
  {
    id: '3',
    rank: 3,
    name: '에그궁',
    address: '경기 수원시 팔달구 화서문로 17번길 6-4',
    rating: 5.0,
    reviews: 34,
    likes: '1.1K',
    rankChange: 0,
    images: [
      require('../../assets/images/egg/egg03.jpg'),
      require('../../assets/images/egg/egg01.jpg'),
      require('../../assets/images/egg/egg02.jpg'),
      require('../../assets/images/eggpalace.png'),
    ],
  },
];

export default function MerchantHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BusinessStackParamList>>();

  const renderItem = ({ item }: { item: typeof STORE_DATA[number] }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (item.name === '행궁 디저트 연구소') {
          navigation.navigate('BusinessHome_user');
        } else {
          alert('준비 중입니다!');
        }
      }}
    >
      <View style={styles.storeContainer}>
        <View style={styles.rowTop}>
          <Text style={styles.rank}>{item.rank}</Text>
          <View style={styles.infoColumn}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.name}</Text>
              <AntDesign name="checkcircle" size={16} color="#48C8FF" style={{ marginLeft: 6 }} />
            </View>
            <Text style={styles.address}>{item.address}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
              <Text style={styles.stars}>★★★★★</Text>
              <Text style={styles.reviews}>({item.reviews})</Text>
            </View>
          </View>
          <View style={styles.likeColumn}>
            <Ionicons name="heart-outline" size={20} color="#BDBDBD" />
            <Text style={styles.likes}>{item.likes}</Text>
          </View>
        </View>

        <View style={styles.imageRow}>
          {item.images.map((img, idx) => (
            <Image
              key={idx}
              style={styles.image}
              source={img}
              resizeMode="cover"
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>스토어</Text>
      <FlatList
        data={STORE_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 12, // 기존: 16
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,       // 기존: 16
    color: '#000000',       // 기존: '#1C1C1E'
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  storeContainer: {
    marginBottom: 40,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rank: {
    fontSize: 22,
    fontWeight: '700',
    color: '#48C8FF',
    marginRight: 8,
    width: 28,
    textAlign: 'center',
  },
  infoColumn: {
    flex: 1,
    marginLeft: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  address: {
    fontSize: 14,
    color: '#4F4F4F',
    marginTop: 4,    // 기존: 6
    marginBottom: 4, // 기존: 8
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#F2C94C',
    fontWeight: '700',
  },
  stars: {
    fontSize: 14,
    color: '#F2C94C',
    fontWeight: '700',
    marginLeft: 6,
  },
  reviews: {
    fontSize: 14,
    color: '#4F4F4F',
    marginLeft: 8,
  },
  likeColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: 50,
  },
  likes: {
    fontSize: 13,
    color: '#48C8FF',
    marginTop: 6,
    textAlign: 'center',
  },
  imageRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  image: {
    width: 100,      // 기존: 90
    height: 100,     // 기존: 90
    borderRadius: 10,
  },
});
