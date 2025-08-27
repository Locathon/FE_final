import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { STYLES } from '../../constants/styles';
import { Post, posts } from '../../data/communityData';
import { users } from '../../data/userData';
import { CommunityStackParamList } from '../../navigation/CommunityNavigator';

const CommunityScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const [activeFilter, setActiveFilter] = useState<'최근' | '인기' | '추천' | '동네소식'>('최근');
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [reportReason, setReportReason] = useState('');
  const isFocused = useIsFocused();
  
  // 상태 관리
  const [likesMap, setLikesMap] = useState<{ [postId: string]: boolean }>({});
  const [commentsMap, setCommentsMap] = useState<{ [postId: string]: string[] }>({});
  const [tempComments, setTempComments] = useState<{ [postId: string]: string }>({});
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([
    '#수원화성', '#행궁동카페', '#수원맛집', '#수원여행', '#수원문화'
  ]);

  // 실시간 채팅 상태
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    userId: string;
    userName: string;
    message: string;
    timestamp: Date;
  }>>([]);
  const [newChatMessage, setNewChatMessage] = useState('');

  useEffect(() => {
    let filtered = [...posts];
    
    // 검색어 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 카테고리 필터링
    if (activeFilter === '동네소식') {
      filtered = filtered.filter(post => post.category === '동네소식');
    } else if (activeFilter === '추천') {
      filtered = filtered.filter(post => post.isRecommended);
    }

    // 정렬
    if (activeFilter === '인기') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else {
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    setDisplayedPosts(filtered);
  }, [activeFilter, isFocused, searchQuery]);

  const toggleLike = (postId: string) => {
    setLikesMap(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleBookmark = (postId: string) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleFollow = (userId: string) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleAddComment = (postId: string) => {
    const comment = tempComments[postId]?.trim();
    if (!comment) return;
    
    setCommentsMap(prev => ({ 
      ...prev, 
      [postId]: [...(prev[postId] || []), comment] 
    }));
    setTempComments(prev => ({ ...prev, [postId]: '' }));
  };

  const handleReportPost = (post: Post) => {
    setSelectedPost(post);
    setShowReportModal(true);
  };

  const submitReport = () => {
    if (!reportReason.trim()) {
      Alert.alert('입력 필요', '신고 사유를 입력해주세요.');
      return;
    }
    
    Alert.alert('신고 완료', '게시물이 신고되었습니다. 검토 후 조치하겠습니다.');
    setShowReportModal(false);
    setReportReason('');
    setSelectedPost(null);
  };

  const sendChatMessage = () => {
    if (!newChatMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      userId: 'currentUser',
      userName: '나',
      message: newChatMessage.trim(),
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [message, ...prev]);
    setNewChatMessage('');
  };

  const renderPostCard = ({ item }: { item: Post }) => {
    const author = users.find(u => u.id === item.userId);
    const isLiked = likesMap[item.id] || false;
    const isBookmarked = bookmarkedPosts.has(item.id);
    const isFollowed = followedUsers.has(item.userId);
    const comments = commentsMap[item.id] || [];

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
        activeOpacity={0.95}
      >
        <View style={styles.cardHeader}>
          <View style={styles.authorInfo}>
            <Image source={author?.avatar} style={styles.avatar} />
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{author?.name}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            <TouchableOpacity 
              style={styles.followButton}
              onPress={() => toggleFollow(item.userId)}
            >
              <Text style={[
                styles.followButtonText,
                isFollowed && styles.followingButtonText
              ]}>
                {isFollowed ? '팔로잉' : '팔로우'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>

        <Text style={styles.place}>
          <Ionicons name="location-outline" size={13} color="#888" /> 
          {item.location || '위치 정보 없음'}
        </Text>

        <Text style={styles.hashtags}>
          {item.hashtags?.join(' ') || '#수원 #여행 #추천'}
        </Text>

        <Text style={styles.contentText} numberOfLines={3}>
          {item.content}
        </Text>

        {item.images && item.images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
            {item.images.map((image, index) => (
              <Image key={index} source={image} style={styles.image} resizeMode="cover" />
            ))}
          </ScrollView>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.action}>
            <TouchableOpacity onPress={() => navigation.navigate('CommentList', { postId: item.id })}>
              <Ionicons name="chatbubble-outline" size={18} color="#444" />
            </TouchableOpacity>
            <Text style={styles.actionText}>{comments.length}</Text>
          </View>
          
          <TouchableOpacity style={styles.action} onPress={() => toggleLike(item.id)}>
            <Ionicons 
              name={isLiked ? 'heart' : 'heart-outline'} 
              size={18} 
              color={isLiked ? '#FF3B30' : '#444'} 
            />
            <Text style={styles.actionText}>{item.likes + (isLiked ? 1 : 0)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.action} onPress={() => toggleBookmark(item.id)}>
            <Ionicons 
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
              size={18} 
              color={isBookmarked ? '#007AFF' : '#444'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.action} onPress={() => handleReportPost(item)}>
            <Ionicons name="flag-outline" size={18} color="#444" />
          </TouchableOpacity>
        </View>

        {/* 댓글 입력 */}
        <View style={styles.commentInput}>
          <TextInput
            style={styles.commentTextInput}
            placeholder="댓글을 입력하세요..."
            value={tempComments[item.id] || ''}
            onChangeText={(text) => setTempComments(prev => ({ ...prev, [item.id]: text }))}
            multiline
          />
          <TouchableOpacity 
            style={styles.commentButton}
            onPress={() => handleAddComment(item.id)}
          >
            <Text style={styles.commentButtonText}>등록</Text>
          </TouchableOpacity>
        </View>

        {/* 댓글 미리보기 */}
        {comments.length > 0 && (
          <View style={styles.commentsPreview}>
            {comments.slice(0, 2).map((comment, index) => (
              <Text key={index} style={styles.commentPreview} numberOfLines={1}>
                <Text style={styles.commentAuthor}>익명</Text>: {comment}
              </Text>
            ))}
            {comments.length > 2 && (
              <Text style={styles.moreComments}>
                댓글 {comments.length - 2}개 더보기
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTrendingHashtag = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.hashtagChip}
      onPress={() => setSearchQuery(item)}
    >
      <Text style={styles.hashtagText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>커뮤니티</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setShowSearchModal(true)} style={styles.headerButton}>
            <Ionicons name="search-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowChatModal(true)} style={styles.headerButton}>
            <Ionicons name="chatbubbles-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('CreatePost')} style={styles.headerButton}>
            <Ionicons name="add-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 인기 해시태그 */}
      <View style={styles.trendingSection}>
        <Text style={styles.trendingTitle}>🔥 인기 해시태그</Text>
        <FlatList
          data={trendingHashtags}
          renderItem={renderTrendingHashtag}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hashtagsContainer}
        />
      </View>

      {/* 필터 탭 */}
      <View style={styles.filterContainer}>
        {(['최근', '인기', '추천', '동네소식'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTab, activeFilter === filter && styles.activeFilterTab]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter && styles.activeFilterText
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 게시물 목록 */}
      <FlatList
        data={displayedPosts}
        renderItem={renderPostCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsContainer}
      />

      {/* 검색 모달 */}
      <Modal visible={showSearchModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.searchModalContainer}>
          <View style={styles.searchModalHeader}>
            <TouchableOpacity onPress={() => setShowSearchModal(false)}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
            <Text style={styles.searchModalTitle}>검색</Text>
            <View style={{ width: 50 }} />
          </View>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="해시태그, 내용, 카테고리로 검색..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => setShowSearchModal(false)}
            >
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* 실시간 채팅 모달 */}
      <Modal visible={showChatModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.chatModalContainer}>
          <View style={styles.chatModalHeader}>
            <TouchableOpacity onPress={() => setShowChatModal(false)}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
            <Text style={styles.chatModalTitle}>실시간 채팅</Text>
            <View style={{ width: 50 }} />
          </View>
          
          <View style={styles.chatContainer}>
            <FlatList
              data={chatMessages}
              renderItem={({ item }) => (
                <View style={[
                  styles.chatMessage,
                  item.userId === 'currentUser' ? styles.myMessage : styles.otherMessage
                ]}>
                  <Text style={styles.chatUserName}>{item.userName}</Text>
                  <Text style={styles.chatMessageText}>{item.message}</Text>
                  <Text style={styles.chatTimestamp}>
                    {item.timestamp.toLocaleTimeString()}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
              inverted
            />
          </View>
          
          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatTextInput}
              placeholder="메시지를 입력하세요..."
              value={newChatMessage}
              onChangeText={setNewChatMessage}
              multiline
            />
            <TouchableOpacity style={styles.chatSendButton} onPress={sendChatMessage}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* 신고 모달 */}
      <Modal visible={showReportModal} animationType="fade" transparent>
        <View style={styles.reportModalOverlay}>
          <View style={styles.reportModal}>
            <Text style={styles.reportModalTitle}>게시물 신고</Text>
            <Text style={styles.reportModalMessage}>
              신고 사유를 선택하거나 입력해주세요.
            </Text>
            
            <View style={styles.reportReasons}>
              {['스팸', '부적절한 내용', '폭력성', '기타'].map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reportReasonButton,
                    reportReason === reason && styles.selectedReportReason
                  ]}
                  onPress={() => setReportReason(reason)}
                >
                  <Text style={[
                    styles.reportReasonText,
                    reportReason === reason && styles.selectedReportReasonText
                  ]}>
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              style={styles.reportTextInput}
              placeholder="추가 설명 (선택사항)"
              value={reportReason === '기타' ? reportReason : ''}
              onChangeText={setReportReason}
              multiline
            />
            
            <View style={styles.reportModalActions}>
              <TouchableOpacity 
                style={styles.cancelReportButton}
                onPress={() => setShowReportModal(false)}
              >
                <Text style={styles.cancelReportButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitReportButton}
                onPress={submitReport}
              >
                <Text style={styles.submitReportButtonText}>신고하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    backgroundColor: '#fff', 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderColor: '#d1d5db' 
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1c1c1e' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  headerButton: { marginLeft: 16 },
  trendingSection: { 
    backgroundColor: '#fff', 
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderColor: '#d1d5db' 
  },
  trendingTitle: { fontSize: 16, fontWeight: '600', color: '#1c1c1e', marginBottom: 12 },
  hashtagsContainer: { paddingRight: 20 },
  hashtagChip: { 
    backgroundColor: '#f0f0f0', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16, 
    marginRight: 8 
  },
  hashtagText: { fontSize: 12, color: '#666', fontWeight: '500' },
  filterContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    paddingHorizontal: 20, 
    paddingVertical: 12 
  },
  filterTab: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 8, 
    borderRadius: 20 
  },
  activeFilterTab: { backgroundColor: STYLES.COLORS.PRIMARY },
  filterText: { fontSize: 14, color: '#666', fontWeight: '500' },
  activeFilterText: { color: '#fff', fontWeight: '600' },
  postsContainer: { padding: 20 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOpacity: 0.07, 
    shadowOffset: { width: 0, height: 6 }, 
    shadowRadius: 12, 
    elevation: 4 
  },
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 16 
  },
  authorInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  authorDetails: { flex: 1 },
  authorName: { fontSize: 14, fontWeight: '600', color: '#1c1c1e', marginBottom: 2 },
  timestamp: { fontSize: 12, color: '#8e8e93' },
  followButton: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16, 
    backgroundColor: STYLES.COLORS.PRIMARY 
  },
  followButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  followingButtonText: { backgroundColor: '#f0f0f0', color: '#666' },
  categoryBadge: { 
    backgroundColor: '#E3F2FD', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  categoryText: { fontSize: 12, fontWeight: '600', color: '#1976D2' },
  place: { fontSize: 13, color: '#888', marginBottom: 8 },
  hashtags: { fontSize: 13, color: '#007AFF', marginBottom: 12 },
  contentText: { fontSize: 15, color: '#1c1c1e', lineHeight: 22, marginBottom: 16 },
  imagesContainer: { marginBottom: 16 },
  image: { width: 120, height: 120, borderRadius: 8, marginRight: 8 },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#f0f0f0' 
  },
  action: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4 
  },
  actionText: { fontSize: 14, color: '#666', marginLeft: 4 },
  commentInput: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 16, 
    gap: 12 
  },
  commentTextInput: { 
    flex: 1, 
    backgroundColor: '#f8f9fa', 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    fontSize: 14 
  },
  commentButton: { 
    backgroundColor: STYLES.COLORS.PRIMARY, 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20 
  },
  commentButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  commentsPreview: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  commentPreview: { fontSize: 13, color: '#666', marginBottom: 4 },
  commentAuthor: { fontWeight: '600', color: '#1c1c1e' },
  moreComments: { fontSize: 12, color: '#007AFF', fontStyle: 'italic' },
  
  // 검색 모달 스타일
  searchModalContainer: { flex: 1, backgroundColor: '#fff' },
  searchModalHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  closeButton: { color: '#007AFF', fontSize: 16 },
  searchModalTitle: { fontSize: 18, fontWeight: '600', color: '#1c1c1e' },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    gap: 12 
  },
  searchInput: { 
    flex: 1, 
    backgroundColor: '#f8f9fa', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    fontSize: 16 
  },
  searchButton: { 
    backgroundColor: STYLES.COLORS.PRIMARY, 
    padding: 12, 
    borderRadius: 12 
  },
  
  // 채팅 모달 스타일
  chatModalContainer: { flex: 1, backgroundColor: '#fff' },
  chatModalHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  chatModalTitle: { fontSize: 18, fontWeight: '600', color: '#1c1c1e' },
  chatContainer: { flex: 1, padding: 20 },
  chatMessage: { 
    backgroundColor: '#f8f9fa', 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 12, 
    maxWidth: '80%' 
  },
  myMessage: { 
    backgroundColor: STYLES.COLORS.PRIMARY, 
    alignSelf: 'flex-end' 
  },
  otherMessage: { alignSelf: 'flex-start' },
  chatUserName: { fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 4 },
  chatMessageText: { fontSize: 14, color: '#1c1c1e' },
  chatTimestamp: { fontSize: 10, color: '#8e8e93', marginTop: 4, alignSelf: 'flex-end' },
  chatInputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    gap: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#f0f0f0' 
  },
  chatTextInput: { 
    flex: 1, 
    backgroundColor: '#f8f9fa', 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    fontSize: 14 
  },
  chatSendButton: { 
    backgroundColor: STYLES.COLORS.PRIMARY, 
    padding: 12, 
    borderRadius: 20 
  },
  
  // 신고 모달 스타일
  reportModalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  reportModal: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 30, 
    marginHorizontal: 40, 
    width: '80%' 
  },
  reportModalTitle: { fontSize: 20, fontWeight: '700', color: '#1c1c1e', marginBottom: 8 },
  reportModalMessage: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  reportReasons: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  reportReasonButton: { 
    width: '48%', 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    backgroundColor: '#f8f9fa', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  selectedReportReason: { backgroundColor: STYLES.COLORS.PRIMARY },
  reportReasonText: { fontSize: 14, color: '#666', fontWeight: '500' },
  selectedReportReasonText: { color: '#fff', fontWeight: '600' },
  reportTextInput: { 
    backgroundColor: '#f8f9fa', 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 14, 
    minHeight: 80, 
    textAlignVertical: 'top', 
    marginBottom: 20 
  },
  reportModalActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 12 
  },
  cancelReportButton: { 
    flex: 1, 
    paddingVertical: 16, 
    borderRadius: 12, 
    backgroundColor: '#f1f3f4', 
    alignItems: 'center' 
  },
  cancelReportButtonText: { color: '#5f6368', fontSize: 16, fontWeight: '600' },
  submitReportButton: { 
    flex: 1, 
    paddingVertical: 16, 
    borderRadius: 12, 
    backgroundColor: '#FF3B30', 
    alignItems: 'center' 
  },
  submitReportButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default CommunityScreen;