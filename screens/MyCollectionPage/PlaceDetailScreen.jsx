import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlaceDetailScreen({ route }) {
    const { id } = route.params;

    // 실제 데이터는 추후 API 또는 상태관리로 대체 가능
    const dummyPlaceDetail = {
        id: 'place1',
        name: '레몬트리',
        image: 'https://placehold.co/600x400/FFCC00/000000?text=Lemon+Tree+Menu',
        tags: ['#행궁인장', '#디저트'],
        description:
            '드디어 레몬트리가 행궁인장을 받았어요! 행궁인장 기념 10% 세일 이벤트 열었으니 확인해보세요~!',
        likes: 14,
        comments: 5,
        bookmarks: 7,
        review: {
            user: '다주',
            text: '여기 커피 맛있죠^^ 다만 알바생이 좀 불친절…',
        },
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{dummyPlaceDetail.name}</Text>
            <Image source={{ uri: dummyPlaceDetail.image }} style={styles.image} />
            <View style={styles.tagContainer}>
                {dummyPlaceDetail.tags.map(tag => (
                    <Text key={tag} style={styles.tagText}>{tag}</Text>
                ))}
            </View>
            <Text style={styles.description}>{dummyPlaceDetail.description}</Text>

            <View style={styles.iconRow}>
                <Ionicons name="chatbubble-outline" size={18} color="gray" />
                <Text style={styles.iconLabel}>{dummyPlaceDetail.comments}</Text>
                <Ionicons name="heart-outline" size={18} color="gray" style={styles.iconGap} />
                <Text style={styles.iconLabel}>{dummyPlaceDetail.likes}</Text>
                <Ionicons name="bookmark-outline" size={18} color="gray" style={styles.iconGap} />
                <Text style={styles.iconLabel}>{dummyPlaceDetail.bookmarks}</Text>
            </View>

            <View style={styles.commentBox}>
                <Text style={styles.commentUser}>{dummyPlaceDetail.review.user}</Text>
                <Text>{dummyPlaceDetail.review.text}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    image: { width: '100%', height: 300, borderRadius: 12, marginBottom: 12 },
    tagContainer: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    tagText: { color: '#2D74DA', fontSize: 13 },
    description: { fontSize: 14, color: '#444', marginBottom: 12 },
    iconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    iconLabel: { marginLeft: 4, color: '#666' },
    iconGap: { marginLeft: 16 },
    commentBox: { padding: 12, backgroundColor: '#FAFAFA', borderRadius: 8 },
    commentUser: { fontWeight: 'bold', marginBottom: 4 },
});