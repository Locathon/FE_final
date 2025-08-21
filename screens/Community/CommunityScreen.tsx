import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Post, posts } from '../../data/communityData';
import { users } from '../../data/userData';
import { CommunityStackParamList } from '../../navigation/CommunityNavigator';

const CommunityScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const [activeFilter, setActiveFilter] = useState<'최근' | '인기' | '추천' | '동네소식'>('최근');
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const isFocused = useIsFocused();
  const [likesMap, setLikesMap] = useState<{ [postId: string]: boolean }>({});
  const [commentsMap, setCommentsMap] = useState<{ [postId: string]: string[] }>({});
  const [tempComments, setTempComments] = useState<{ [postId: string]: string }>({});
  const toggleLike = (postId: string) => {
    setLikesMap(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId: string) => {
    const comment = tempComments[postId]?.trim();
    if (!comment) return;
    setCommentsMap(prev => ({ ...prev, [postId]: [...(prev[postId] || []), comment] }));
    setTempComments(prev => ({ ...prev, [postId]: '' }));
  };

  useEffect(() => {
    let filtered = [...posts];
    if (activeFilter === '동네소식') {
      filtered = filtered.filter(post => post.category === '동네소식');
    } else if (activeFilter === '추천') {
      filtered = filtered.filter(post => post.isRecommended);
    }

    if (activeFilter === '인기') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else {
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    setDisplayedPosts(filtered);
  }, [activeFilter, isFocused]);

  const renderPostCard = ({ item }: { item: Post }) => {
    const author = users.find(u => u.id === item.userId);

    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PostDetail', { postId: item.id })}>
        <View style={styles.cardHeader}>
          <View style={styles.authorInfo}>
            <Image source={author?.avatar} style={styles.avatar} />
            <View>
              <Text style={styles.authorName}>{author?.name}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>

        <Text style={styles.place}>
          <Ionicons name="location-outline" size={13} color="#888" /> 필립스 스마트 조명
        </Text>

        <Text style={styles.hashtags}>#카페 #커피전문</Text>

        <Text style={styles.contentText} numberOfLines={1}>
          {item.content}
        </Text>

        {item.images && item.images.length > 0 && (
          <Image source={item.images[0]} style={styles.image} resizeMode="cover" />
        )}

        <View style={styles.cardFooter}>
          <View style={styles.action}>
            <Ionicons name="chatbubble-outline" size={18} color="#444" />
            <Text style={styles.actionText}>{item.commentsCount}</Text>
          </View>
          <View style={styles.action}>
            <Ionicons name="heart-outline" size={18} color="#444" />
            <Text style={styles.actionText}>{item.likes}</Text>
          </View>
          <View style={styles.action}>
            <Ionicons name="share-social-outline" size={18} color="#444" />
            <Text style={styles.actionText}>7</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.centerTitle}>
          <Text style={styles.title}>커뮤니티</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => navigation.navigate('Notification')}>
            <Ionicons name="add" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sortTabs}>
        {(['최근', '인기', '추천', '동네소식'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[styles.sortButton, activeFilter === filter && styles.activeSortButton]}
          >
            <Text style={[styles.sortText, activeFilter === filter && styles.activeSortText]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={displayedPosts}
        renderItem={renderPostCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreatePost')}>
        <Ionicons name="add" size={24} color="#FFF" />
        <Text style={styles.fabText}>새로운 포스트</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  // Header 스타일
  header: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    position: 'relative',
  },
  centerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: { flexDirection: 'row' },

  // 탭
  sortTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginHorizontal: 16,
    marginBottom: 4,
  },
  sortButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeSortButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#3ECFFF', // ⬅ 변경됨
  },
  sortText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  activeSortText: {
    color: '#000',
    fontWeight: 'bold',
  },

  listContainer: {
    paddingBottom: 80,
  },

  // 게시글 카드
  card: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  authorName: { fontWeight: 'bold', fontSize: 14, color: '#222' },
  timestamp: { fontSize: 12, color: '#999' },
  categoryBadge: {
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: { fontSize: 11, color: '#666', fontWeight: '500' },

  place: { fontSize: 13, color: '#888', marginBottom: 2 },
  hashtags: {
    fontSize: 13,
    color: '#2D9CDB',
    marginBottom: 2, // 줄바꿈 방지 목적
  },
  contentText: { fontSize: 15, color: '#333', marginBottom: 10 },

  image: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#eee',
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingLeft: 16,
    gap: 28,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },

  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 40,
    borderRadius: 36,
    backgroundColor: '#48C8FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    gap: 8,
  },
  fabText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },

  fabImage: {
    width: 180,    // 필요에 따라 조절
    height: 60,    // 필요에 따라 조절
    resizeMode: 'contain',
  },
});

export default CommunityScreen;