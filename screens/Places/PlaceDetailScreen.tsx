// C:\Users\mnb09\Desktop\Temp\screens\Places\PlaceDetailScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { apiClient } from '../../services/api';

type Place = {
  id: string;
  name: string;
  content: string;
  imageUrls: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewCount?: number;
  category?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
};

type Review = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  images?: string[];
};

type RootStackParamList = {
  PlaceDetail: { placeId: string };
};

type PlaceDetailRouteProp = RouteProp<RootStackParamList, 'PlaceDetail'>;

const screenWidth = Dimensions.get('window').width;

export default function PlaceDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<PlaceDetailRouteProp>();
  const { placeId } = route.params;

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const init = async () => {
      try {
        await fetchPlace(placeId);
        await fetchReviews(placeId);
        await checkFavoriteStatus(placeId);
      } catch (_err) {
        setErrorMsg('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [placeId]);

  const fetchPlace = async (id: string) => {
    try {
      const data = await apiClient(`/places/${id}`, { method: 'GET' });

      if (!data.address && data.latitude && data.longitude) {
        try {
          const geoRes = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.latitude},${data.longitude}&language=ko&key=AIzaSyA38Wx1aAoueHqiOsWVlTYSIAvRtO6RW6g`
          );
          const geoJson = await geoRes.json();
          data.address = geoJson.results[0]?.formatted_address ?? '주소 정보 없음';
        } catch (geoError) {
          data.address = '주소 정보 없음';
        }
      }

      let urls: string[] = Array.isArray(data.imageUrls) ? data.imageUrls : (typeof data.imageUrls === 'string' ? [data.imageUrls] : []);
      data.imageUrls = Array.from(new Set(urls)).filter(url => typeof url === 'string' && url.trim() !== '');
      
      // 기본값 설정
      data.rating = data.rating || 4.5;
      data.reviewCount = data.reviewCount || 0;
      data.category = data.category || '기타';
      data.phone = data.phone || '전화번호 없음';
      data.website = data.website || '';
      data.openingHours = data.openingHours || '영업시간 정보 없음';
      
      setPlace(data);
    } catch (_err) {
      setErrorMsg('장소 데이터를 불러오는 데 실패했습니다.');
    }
  };

  const fetchReviews = async (placeId: string) => {
    try {
      const response = await apiClient(`/places/${placeId}/reviews`, { method: 'GET' });
      setReviews(response || []);
    } catch (_err) {
      // 리뷰가 없어도 오류로 처리하지 않음
      setReviews([]);
    }
  };

  const checkFavoriteStatus = async (placeId: string) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        const response = await apiClient(`/places/${placeId}/favorite`, { method: 'GET' });
        setIsFavorite(response?.isFavorite || false);
      }
    } catch (_err) {
      setIsFavorite(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        Alert.alert('로그인 필요', '즐겨찾기를 사용하려면 로그인이 필요합니다.');
        return;
      }

      const method = isFavorite ? 'DELETE' : 'POST';
      await apiClient(`/places/${placeId}/favorite`, { method });
      setIsFavorite(!isFavorite);
      
      Alert.alert(
        isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가',
        isFavorite ? '즐겨찾기에서 제거되었습니다.' : '즐겨찾기에 추가되었습니다.'
      );
    } catch (_err) {
      Alert.alert('오류', '즐겨찾기 처리 중 오류가 발생했습니다.');
    }
  };

  const sharePlace = () => {
    Alert.alert('공유', `${place?.name} 장소를 공유합니다.`);
  };

  const submitReview = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        Alert.alert('로그인 필요', '리뷰를 작성하려면 로그인이 필요합니다.');
        return;
      }

      if (!newReview.comment.trim()) {
        Alert.alert('입력 필요', '리뷰 내용을 입력해주세요.');
        return;
      }

      await apiClient(`/places/${placeId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(newReview),
      });

      Alert.alert('성공', '리뷰가 등록되었습니다.');
      setShowReviewInput(false);
      setNewReview({ rating: 5, comment: '' });
      await fetchReviews(placeId);
    } catch (_err) {
      Alert.alert('오류', '리뷰 등록 중 오류가 발생했습니다.');
    }
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image 
          source={item.userAvatar ? { uri: item.userAvatar } : require('../../assets/images/default-profile.png')} 
          style={styles.reviewAvatar} 
        />
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewUserName}>{item.userName}</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= item.rating ? 'star' : 'star-outline'}
                size={16}
                color={star <= item.rating ? '#FFD700' : '#DDD'}
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewDate}>{item.createdAt}</Text>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
      {item.images && item.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewImages}>
          {item.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
          ))}
        </ScrollView>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>로딩 중...</Text>
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>뒤로 가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!place) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>장소 정보를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{place.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleFavorite} style={styles.headerButton}>
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? '#FF6B6B' : '#333'} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={sharePlace} style={styles.headerButton}>
            <Ionicons name="share-social-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        {/* 이미지 캐러셀 */}
        {place.imageUrls.length > 0 ? (
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageCarousel}>
            {place.imageUrls.map((url, index) => (
              <Image key={index} source={{ uri: url }} style={styles.carouselImage} />
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.carouselImage, styles.centered]}>
            <Text>이미지가 없습니다</Text>
          </View>
        )}

        {/* 장소 정보 */}
        <View style={styles.infoSection}>
          <View style={styles.ratingRow}>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= (place.rating || 0) ? 'star' : 'star-outline'}
                  size={20}
                  color={star <= (place.rating || 0) ? '#FFD700' : '#DDD'}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>{place.rating} ({place.reviewCount}개 리뷰)</Text>
          </View>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{place.category}</Text>
          </View>
        </View>

        {/* 장소 소개 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>장소 소개</Text>
          <Text style={styles.content}>
            {place.content && place.content.trim().length > 0 ? place.content : '설명 정보가 없습니다.'}
          </Text>
        </View>

        {/* 기본 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기본 정보</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{place.address ?? '주소 정보 없음'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{place.openingHours}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{place.phone}</Text>
          </View>
          {place.website && (
            <View style={styles.infoRow}>
              <Ionicons name="globe-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{place.website}</Text>
            </View>
          )}
        </View>

        {/* 지도 */}
        {place.latitude && place.longitude && (
          <View style={styles.mapContainer}>
            <Text style={styles.sectionTitle}>위치</Text>
            <MapView 
              style={styles.map} 
              initialRegion={{ 
                latitude: place.latitude, 
                longitude: place.longitude, 
                latitudeDelta: 0.002, 
                longitudeDelta: 0.002 
              }}
            >
              <Marker coordinate={{ latitude: place.latitude, longitude: place.longitude }} />
            </MapView>
          </View>
        )}

        {/* 리뷰 섹션 */}
        <View style={styles.section}>
          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle}>리뷰 ({reviews.length})</Text>
            <TouchableOpacity onPress={() => setShowReviewInput(!showReviewInput)}>
              <Text style={styles.writeReviewText}>리뷰 작성</Text>
            </TouchableOpacity>
          </View>

          {/* 리뷰 작성 폼 */}
          {showReviewInput && (
            <View style={styles.reviewInputContainer}>
              <View style={styles.ratingInput}>
                <Text style={styles.ratingLabel}>평점:</Text>
                <View style={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setNewReview({ ...newReview, rating: star })}
                    >
                      <Ionicons
                        name={star <= newReview.rating ? 'star' : 'star-outline'}
                        size={24}
                        color={star <= newReview.rating ? '#FFD700' : '#DDD'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TextInput
                style={styles.reviewTextInput}
                placeholder="리뷰를 작성해주세요..."
                value={newReview.comment}
                onChangeText={(text) => setNewReview({ ...newReview, comment: text })}
                multiline
                numberOfLines={3}
              />
              <View style={styles.reviewActions}>
                <TouchableOpacity onPress={() => setShowReviewInput(false)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={submitReview} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>등록</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 리뷰 목록 */}
          {reviews.length > 0 ? (
            <FlatList
              data={reviews}
              renderItem={renderReviewItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noReviewText}>아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    justifyContent: 'space-between', 
    backgroundColor: '#fff', 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderColor: '#d1d5db', 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowOffset: { width: 0, height: 1 }, 
    shadowRadius: 4, 
    elevation: 2 
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1c1c1e', flex: 1, textAlign: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  headerButton: { marginLeft: 16 },
  imageCarousel: { width: '100%', height: 240, backgroundColor: '#f2f2f7' },
  carouselImage: { width: screenWidth, height: 240, resizeMode: 'cover' },
  infoSection: { 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    marginTop: 20, 
    borderRadius: 16, 
    padding: 18, 
    shadowColor: '#000', 
    shadowOpacity: 0.07, 
    shadowOffset: { width: 0, height: 6 }, 
    shadowRadius: 12, 
    elevation: 4 
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 16, fontWeight: '600', color: '#1c1c1e' },
  categoryBadge: { 
    backgroundColor: '#E3F2FD', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    alignSelf: 'flex-start' 
  },
  categoryText: { fontSize: 12, fontWeight: '600', color: '#1976D2' },
  section: { 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    marginTop: 20, 
    borderRadius: 16, 
    padding: 18, 
    shadowColor: '#000', 
    shadowOpacity: 0.07, 
    shadowOffset: { width: 0, height: 6 }, 
    shadowRadius: 12, 
    elevation: 4 
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1c1c1e', marginBottom: 12 },
  content: { fontSize: 15, color: '#3c3c4399', lineHeight: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  infoText: { marginLeft: 10, fontSize: 15, color: '#1c1c1e' },
  mapContainer: { height: 220, marginTop: 24, marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 8 }, shadowRadius: 15, elevation: 5 },
  map: { flex: 1 },
  errorText: { color: '#ff3b30', fontSize: 16, marginBottom: 16, fontWeight: '600', textAlign: 'center' },
  backButton: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: 'rgba(118, 118, 128, 0.12)', borderRadius: 16 },
  backText: { fontSize: 16, color: '#1c1c1e', fontWeight: '600' },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  writeReviewText: { color: '#007AFF', fontSize: 14, fontWeight: '600' },
  reviewInputContainer: { 
    backgroundColor: '#f8f9fa', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16 
  },
  ratingInput: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ratingLabel: { fontSize: 14, fontWeight: '600', color: '#1c1c1e', marginRight: 12 },
  ratingStars: { flexDirection: 'row' },
  reviewTextInput: { 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 14, 
    minHeight: 80, 
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e1e5e9'
  },
  reviewActions: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginTop: 12, 
    gap: 12 
  },
  cancelButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 8, 
    backgroundColor: '#f1f3f4' 
  },
  cancelButtonText: { color: '#5f6368', fontSize: 14, fontWeight: '500' },
  submitButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 8, 
    backgroundColor: '#007AFF' 
  },
  submitButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  noReviewText: { 
    textAlign: 'center', 
    color: '#8e8e93', 
    fontSize: 14, 
    fontStyle: 'italic' 
  },
  reviewItem: { 
    backgroundColor: '#f8f9fa', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12 
  },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  reviewInfo: { flex: 1 },
  reviewUserName: { fontSize: 14, fontWeight: '600', color: '#1c1c1e', marginBottom: 4 },
  reviewDate: { fontSize: 12, color: '#8e8e93' },
  reviewComment: { fontSize: 14, color: '#1c1c1e', lineHeight: 20, marginTop: 8 },
  reviewImages: { marginTop: 8 },
  reviewImage: { width: 80, height: 80, borderRadius: 8, marginRight: 8 },
});
