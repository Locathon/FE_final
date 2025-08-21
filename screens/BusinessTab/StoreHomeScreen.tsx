// C:\Users\mnb09\Desktop\Temp\screens\Business\StoreHomeScreen.tsx

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// [오류 수정] 중복된 import 구문을 정리합니다.
import React, { useCallback, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';

const aiTransitionIcon = require('../../assets/images/ai_transition.png');

// [문제 #4 해결] 디저트 카페에 어울리는 새로운 임시 데이터
const DESSERT_CAFE_DATA = {
    name: '행궁 디저트 연구소',
    tag: '디저트카페',
    profileImage: require('../../assets/images/desserts/cafe_profile.png'), // 새 프로필 이미지
    menuImages: [
        require('../../assets/images/desserts/dessert_1.jpg'),
        require('../../assets/images/desserts/dessert_2.jpg'),
        require('../../assets/images/desserts/dessert_3.jpg'),
        require('../../assets/images/desserts/dessert_4.jpg'),
        require('../../assets/images/desserts/cafe_profile.jpg'),
    ],
    address: '경기도 수원시 행궁동 238-234',
    phone: '031-123-4567',
    website: 'https://instagram.com/slow.haenggung',
    rating: 4.8,
    reviewCount: 124,
    description: '매일 아침 신선한 재료로 만드는 수제 디저트와 스페셜티 커피를 즐겨보세요. 행궁동의 작은 골목에서 발견하는 달콤한 행복.',
    openingHours: '11:00 ~ 21:00',
    holidays: ['월요일'],
};

const DESSERT_REVIEWS = [
    { rating: 5.0, stars: '★★★★★', text: '푸딩을 먹었는데 일본서 먹던 깊은 맛이 나서 좋았어요!!!', images: [DESSERT_CAFE_DATA.menuImages[0], DESSERT_CAFE_DATA.menuImages[1]]},
    { rating: 5.0, stars: '★★★★★', text: '커피 맛이 좋고 분위기가 아늑해서 자주 방문할 것 같아요~', images: [] },
    { rating: 4.0, stars: '★★★★☆', text: '딸기 케이크가 정말 맛있어요! 인생 케이크 등극!', images: [DESSERT_CAFE_DATA.menuImages[2]] },
    { rating: 5.0, stars: '★★★★★', text: '인테리어가 예뻐서 사진 찍기 너무 좋아요. 데이트 코스로 추천!', images: [DESSERT_CAFE_DATA.menuImages[4]] },
];

const DEFAULT_QAS = [
    { question: '오늘 영업하나요?', answer: '네, 오늘 정상 영업합니다!' },
    { question: '주차장 있나요?', answer: '네, 건물 앞 주차장 이용 가능합니다.' },
];

export default function StoreHomeScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<{ params: any }, 'params'>>();
    
    const [qaList, setQaList] = useState(DEFAULT_QAS);
    
    useFocusEffect(
        useCallback(() => {
            if (route.params?.qas) {
                setQaList(route.params.qas);
                navigation.setParams({ qas: undefined });
            }
        }, [route.params?.qas])
    );
    
    const [activeTab, setActiveTab] = useState<'Home' | 'Review' | 'QA'>('Home');
    const [liked, setLiked] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const { width } = useWindowDimensions();
    
    const { name, description, tag, location, startHour, endHour, phone, website, holidays, profileImage, menuImages } = route.params || {};
    const displayData = {
        name: name || DESSERT_CAFE_DATA.name,
        tag: tag || DESSERT_CAFE_DATA.tag,
        description: description || DESSERT_CAFE_DATA.description,
        address: location || DESSERT_CAFE_DATA.address,
        openingHours: (startHour && endHour) ? `${startHour} ~ ${endHour}` : DESSERT_CAFE_DATA.openingHours,
        phone: phone || DESSERT_CAFE_DATA.phone,
        website: website || DESSERT_CAFE_DATA.website,
        holidays: (holidays && holidays.length > 0) ? holidays : DESSERT_CAFE_DATA.holidays,
        profileImage: profileImage ? { uri: profileImage } : DESSERT_CAFE_DATA.profileImage,
        menuImages: (menuImages && menuImages.length > 0) ? menuImages.map((img: any) => img ? {uri: img} : null) : DESSERT_CAFE_DATA.menuImages,
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}><Text style={styles.headerTitle}>스토어</Text></View>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}>
                <View style={styles.imageGrid}><Image source={displayData.profileImage} style={styles.gridImage} /></View>
                <View style={styles.storeInfoRow}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Text style={styles.storeName}>{displayData.name}</Text>
                            <Text style={styles.inlineStoreTag}>  {displayData.tag}</Text>
                        </View>
                        <View style={styles.tagRow}>
                            <View style={styles.ratingRow}>
                                <Text style={styles.ratingText}>{DESSERT_CAFE_DATA.rating.toFixed(1)}</Text>
                                <Ionicons name="star" size={14} color="#F2C94C" style={{marginLeft: 4}}/>
                                <Text style={styles.reviewCount}>({DESSERT_CAFE_DATA.reviewCount} 후기)</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => setLiked(!liked)} style={styles.likeButton}>
                        <Ionicons name={liked ? "heart" : "heart-outline"} size={28} color={liked ? '#EB5757' : '#828282'} />
                        <Text style={styles.likeText}>찜하기</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 16, marginTop: 12 }}><RenderHTML contentWidth={width} source={{ html: displayData.description }} /></View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 16 }}>
                  <TouchableOpacity style={[styles.editButton, { flex: 1, marginRight: 8 }]} onPress={() => navigation.navigate('EditStore', route.params || {})}>
                    <Text style={styles.editButtonText}>스토어 편집</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.editButton, { flex: 1, marginRight: 8 }]} onPress={() => navigation.navigate('QASetup')}>
                    <Text style={styles.editButtonText}>Q&A 수정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sparkleButton} onPress={() => navigation.navigate('GenerateMarketing')}>
                    <Image source={aiTransitionIcon} style={{ width: 20, height: 20, tintColor: 'white' }} />
                  </TouchableOpacity>
                </View>

                <View style={styles.bottomTabs}>
                    <TouchableOpacity style={[styles.tabButton, activeTab === 'Home' && styles.activeTab]} onPress={() => setActiveTab('Home')}><Text style={[styles.tabText, activeTab === 'Home' && styles.activeTabText]}>Home</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.tabButton, activeTab === 'Review' && styles.activeTab]} onPress={() => setActiveTab('Review')}><Text style={[styles.tabText, activeTab === 'Review' && styles.activeTabText]}>리뷰</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.tabButton, activeTab === 'QA' && styles.activeTab]} onPress={() => setActiveTab('QA')}><Text style={[styles.tabText, activeTab === 'QA' && styles.activeTabText]}>Q&A</Text></TouchableOpacity>
                </View>

                {activeTab === 'Home' && (
                    <>
                        <View style={styles.infoBlocks}>
                            <View style={styles.infoBlock}><Ionicons name="location-outline" size={24} color="#2F80ED" style={{marginTop: 2}} /><View style={styles.infoTextWrapper}><Text style={styles.infoTitle}>위치안내</Text><Text style={styles.infoContent}>{displayData.address}</Text></View></View>
                            <View style={styles.infoBlock}><Ionicons name="time-outline" size={24} color="#2F80ED" style={{marginTop: 2}} /><View style={styles.infoTextWrapper}><Text style={styles.infoTitle}>영업시간</Text><Text style={styles.infoContent}>{displayData.openingHours}</Text></View></View>
                            <View style={styles.infoBlock}><Ionicons name="call-outline" size={24} color="#2F80ED" style={{marginTop: 2}} /><View style={styles.infoTextWrapper}><Text style={styles.infoTitle}>전화번호</Text><Text style={styles.infoContent}>{displayData.phone}</Text></View></View>
                            <View style={styles.infoBlock}><Ionicons name="calendar-outline" size={24} color="#2F80ED" style={{marginTop: 2}} /><View style={styles.infoTextWrapper}><Text style={styles.infoTitle}>휴무일</Text><Text style={styles.infoContent}>{displayData.holidays.join(', ')}</Text></View></View>
                            <View style={styles.infoBlock}><MaterialCommunityIcons name="web" size={24} color="#2F80ED" style={{marginTop: 2}} /><View style={styles.infoTextWrapper}><Text style={styles.infoTitle}>웹사이트</Text><Text style={styles.infoContent}>{displayData.website}</Text></View></View>
                        </View>
                        <Text style={styles.menuSectionTitle}>메뉴</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuScroll}>
                            {displayData.menuImages.map((img: any, idx: number) => img && <Image key={idx} source={img} style={styles.menuImage} />)}
                        </ScrollView>
                    </>
                )}

                {activeTab === 'Review' && (
                    <View style={{ marginTop: 24, marginHorizontal: 16 }}>
                        {DESSERT_REVIEWS.map((review, idx) => (
                            <View key={idx} style={{ marginBottom: 24 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <Image source={DESSERT_CAFE_DATA.profileImage} style={{ borderRadius: 9999, width: 32, height: 32, marginRight: 8 }} />
                                    <Image source={DESSERT_CAFE_DATA.profileImage} style={{ borderRadius: 9999, width: 32, height: 32, marginRight: 8 }} />
                                </View>
                                <Text style={{ fontSize: 15, fontWeight: '600', color: '#333333', marginBottom: 10 }}>{review.rating.toFixed(1)} <Text style={{ color: '#F2C94C', fontSize: 16 }}>{review.stars}</Text></Text>
                                {review.images.length > 0 && <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 12, marginBottom: 16 }}>{review.images.map((img: any, i: number) => <Image key={i} source={img} resizeMode="cover" style={{ width: review.images.length === 1 ? '100%' : 165, height: review.images.length === 1 ? 180 : 120, borderRadius: 16, }} />)}</View>}
                                <Text style={{ fontSize: 15, color: '#333333', fontWeight: '500', marginBottom: 8 }}>{review.text}</Text>
                                <Text style={{ fontSize: 13, color: '#828282' }}>25.06.15 · {idx + 1}번째 방문</Text>
                            </View>
                        ))}
                    </View>
                )}

                {activeTab === 'QA' && (
                    <View style={{ marginTop: 24, marginHorizontal: 16 }}>
                        {qaList.length > 0 ? (
                            qaList.map((qa, idx) => (
                                <View key={idx} style={{ marginBottom: 28 }}>
                                    <TouchableOpacity onPress={() => setExpandedIndex(expandedIndex === idx ? null : idx)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 10, flex: 1 }}>{qa.question}</Text>
                                        <Text style={{ fontSize: 18, marginBottom: 10 }}>{expandedIndex === idx ? '˄' : '˅'}</Text>
                                    </TouchableOpacity>
                                    {expandedIndex === idx && <View style={{ backgroundColor: '#F4F4F4', padding: 16, borderRadius: 12 }}><Text style={{ fontSize: 14, color: '#333333', lineHeight: 20 }}>{qa.answer}</Text></View>}
                                </View>
                            ))
                        ) : <Text style={{ color: '#999' }}>등록된 Q&A가 없습니다.</Text>}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
// 스타일 시트는 이전과 동일하게 유지
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 64, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E5E5' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  container: { flex: 1 },
  imageGrid: { marginHorizontal: 16, marginTop: 16, alignItems: 'center', justifyContent: 'center' },
  gridImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  storeInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 16, marginTop: 8 },
  storeName: { fontSize: 24, fontWeight: '700', color: '#333333' },
  inlineStoreTag: { fontSize: 14, color: '#828282', marginLeft: 8, paddingHorizontal: 8, paddingVertical: 2, textAlignVertical: 'center' },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 14, color: '#4F4F4F' },
  reviewCount: { fontSize: 14, color: '#828282', marginLeft: 6 },
  likeButton: { alignItems: 'center' },
  likeText: { fontSize: 12, color: '#828282', marginTop: 2 },
  editButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  editButton: {
      width: '42%',
      height: 48,
      borderRadius: 24,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#D3DDE3',
      justifyContent: 'center',
      alignItems: 'center',
  },
    editButtonText: {
        fontSize: 16, // 기존 18 → 16
        fontWeight: '600',
        color: '#1C1C1E',
  },
    sparkleButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#48C8FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
  bottomTabs: { flexDirection: 'row', marginHorizontal: 16, marginTop: 24, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#2F80ED' },
  tabText: { fontSize: 16, color: '#828282', fontWeight: '600' },
  activeTabText: { color: '#2F80ED' },
  infoBlocks: { marginTop: 24, marginHorizontal: 16 },
  infoBlock: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 },
  infoTextWrapper: { marginLeft: 12, flex: 1 },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#333333', marginBottom: 4 },
  infoContent: { fontSize: 14, color: '#4F4F4F', lineHeight: 20 },
  menuSectionTitle: { fontSize: 18, fontWeight: '700', color: '#333333', marginHorizontal: 16, marginTop: 16, marginBottom: 8 },
  menuScroll: { paddingLeft: 16, marginBottom: 32 },
  menuImage: { width: 150, height: 110, borderRadius: 12, marginRight: 12 },
});
