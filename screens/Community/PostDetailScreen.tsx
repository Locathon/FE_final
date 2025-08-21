import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Comment, Post, posts } from '../../data/communityData';
import { currentUser, users } from '../../data/userData';
import { CommunityStackParamList } from '../../navigation/CommunityNavigator';

type PostDetailScreenNavigationProp = NativeStackNavigationProp<CommunityStackParamList, 'PostDetail'>;
type PostDetailScreenRouteProp = RouteProp<CommunityStackParamList, 'PostDetail'>;

const PostDetailScreen = () => {
    const navigation = useNavigation<PostDetailScreenNavigationProp>();
    const route = useRoute<PostDetailScreenRouteProp>();
    const { postId } = route.params;
    
    const [post, setPost] = useState<Post | undefined>(() => posts.find(p => p.id === postId));
    const [commentText, setCommentText] = useState('');
    const [isMenuVisible, setMenuVisible] = useState(false);
    
    const postAuthor = users.find(u => u.id === post?.userId);

    useEffect(() => {
        setPost(posts.find(p => p.id === postId));
    }, [postId]);

    const handleLikePost = () => {
        const postInDb = posts.find(p => p.id === postId);
        if (!postInDb) return;
        postInDb.iLiked = !postInDb.iLiked;
        postInDb.likes = postInDb.iLiked ? postInDb.likes + 1 : postInDb.likes - 1;
        setPost({ ...postInDb });
    };

    const handleLikeComment = (commentId: string) => {
        const postInDb = posts.find(p => p.id === postId);
        if (!postInDb) return;
        const commentInDb = postInDb.comments.find(c => c.id === commentId);
        if (!commentInDb) return;
        commentInDb.iLiked = !commentInDb.iLiked;
        commentInDb.likes = commentInDb.iLiked ? commentInDb.likes + 1 : commentInDb.likes - 1;
        setPost({ ...postInDb });
    };

    const handleCommentSubmit = () => {
        const postInDb = posts.find(p => p.id === postId);
        if (!postInDb || commentText.trim() === '') return;
        const newComment: Comment = {
            id: `c${Date.now()}`,
            userId: currentUser.id,
            content: commentText,
            timestamp: '방금 전',
            likes: 0,
            iLiked: false,
        };
        postInDb.comments.unshift(newComment);
        postInDb.commentsCount = postInDb.comments.length;
        setPost({ ...postInDb });
        setCommentText('');
        Keyboard.dismiss();
    };

    const handleDeletePost = () => {
        setMenuVisible(false);
        Alert.alert("게시물 삭제", "정말로 이 게시물을 삭제하시겠습니까?", [
            { text: "취소", style: "cancel" },
            { 
                text: "확인", 
                onPress: () => {
                    const postIndex = posts.findIndex(p => p.id === postId);
                    if (postIndex > -1) {
                        posts.splice(postIndex, 1);
                    }
                    navigation.goBack();
                },
                style: "destructive" 
            },
        ]);
    };

    const handleEditPost = () => {
        if (!post) return;
        setMenuVisible(false);
        navigation.navigate('EditPost', { postId: post.id });
    };

    if (!post || !postAuthor) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                     <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={styles.errorContainer}>
                    <Text>게시물을 찾을 수 없습니다.</Text>
                </View>
            </SafeAreaView>
        );
    }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            {post.userId === currentUser.id && (
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                </TouchableOpacity>
            )}
        </View>
        
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
                <TouchableOpacity style={styles.authorSection} onPress={() => navigation.navigate('UserProfile', { userId: post.userId })}>
                    <Image source={postAuthor.avatar} style={styles.avatar} />
                    <View>
                        <Text style={styles.authorName}>{postAuthor.name}</Text>
                        <Text style={styles.timestamp}>{post.timestamp}</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.contentSection}>
                    <Text style={styles.title}>{post.title}</Text>
                    <Text style={styles.content}>{post.content}</Text>
                    {post.images && post.images.length > 0 && <Image source={post.images[0]} style={styles.thumbnail} />}
                </View>

                <View style={styles.statsSection}>
                    <Ionicons name="heart-outline" size={16} color="#828282" />
                    <Text style={styles.statsText}>{post.likes}</Text>
                    <Ionicons name="chatbubble-outline" size={16} color="#828282" style={{ marginLeft: 12 }} />
                    <Text style={styles.statsText}>{post.commentsCount}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.actionsSection}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleLikePost}>
                        <Ionicons name={post.iLiked ? "heart" : "heart-outline"} size={22} color={post.iLiked ? "#EB5757" : "#4F4F4F"} />
                        <Text style={[styles.actionText, { color: post.iLiked ? "#EB5757" : "#4F4F4F" }]}>좋아요</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbubble-outline" size={22} color="#4F4F4F" />
                        <Text style={styles.actionText}>댓글</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.commentSection}>
                    {post.comments.map((comment) => {
                        const commentAuthor = users.find(u => u.id === comment.userId);
                        if(!commentAuthor) return null;
                        return (
                        <View key={comment.id} style={styles.commentItem}>
                            <Image source={commentAuthor.avatar} style={styles.commentAvatar} />
                            <View style={styles.commentBubble}>
                                <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: comment.userId })}>
                                    <Text style={styles.commentAuthor}>{commentAuthor.name}</Text>
                                </TouchableOpacity>
                                <Text style={styles.commentContent}>{comment.content}</Text>
                                <View style={styles.commentFooter}>
                                    <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                                    <TouchableOpacity style={styles.commentLikeButton} onPress={() => handleLikeComment(comment.id)}>
                                        <Ionicons name={comment.iLiked ? "heart" : "heart-outline"} size={14} color={comment.iLiked ? "#EB5757" : "#828282"} />
                                        <Text style={styles.commentLikeText}>{comment.likes > 0 && String(comment.likes)}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )})}
                </View>
            </ScrollView>
            <View style={styles.commentInputContainer}>
                <TextInput style={styles.commentInput} placeholder="댓글을 입력하세요..." value={commentText} onChangeText={setCommentText} />
                <TouchableOpacity style={styles.submitButton} onPress={handleCommentSubmit}>
                    <Text style={styles.submitButtonText}>등록</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
        <Modal transparent={true} visible={isMenuVisible} onRequestClose={() => setMenuVisible(false)} animationType="fade">
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={handleEditPost}><Text style={styles.menuText}>수정</Text></TouchableOpacity>
                    <View style={styles.menuDivider} />
                    <TouchableOpacity style={styles.menuItem} onPress={handleDeletePost}><Text style={[styles.menuText, styles.deleteText]}>삭제</Text></TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
    authorSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
    authorName: { fontWeight: 'bold', fontSize: 15 },
    timestamp: { fontSize: 12, color: '#828282' },
    contentSection: { paddingHorizontal: 16, marginBottom: 24 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    content: { fontSize: 16, lineHeight: 24, color: '#333' },
    thumbnail: { width: '100%', height: 250, borderRadius: 12, marginTop: 16, backgroundColor: '#F0F0F0' },
    statsSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12, },
    statsText: { marginLeft: 4, color: '#828282', fontSize: 14 },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 16 },
    actionsSection: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    actionButton: { flexDirection: 'row', alignItems: 'center' },
    actionText: { marginLeft: 6, fontSize: 15, fontWeight: '500' },
    commentSection: { paddingHorizontal: 16, paddingTop: 16 },
    commentItem: { flexDirection: 'row', marginBottom: 16 },
    commentAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 12 },
    commentBubble: { flex: 1, backgroundColor: '#F9F9F9', borderRadius: 12, padding: 12 },
    commentAuthor: { fontWeight: 'bold', fontSize: 13, marginBottom: 4 },
    commentContent: { fontSize: 14, color: '#333' },
    commentFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    commentTimestamp: { fontSize: 12, color: '#828282' },
    commentLikeButton: { flexDirection: 'row', alignItems: 'center' },
    commentLikeText: { marginLeft: 4, fontSize: 12, color: '#828282' },
    commentInputContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1, borderTopColor: '#EFEFEF', backgroundColor: '#FFF' },
    commentInput: { flex: 1, backgroundColor: '#F0F0F0', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 8 },
    submitButton: { backgroundColor: '#2F80ED', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
    submitButtonText: { color: '#FFF', fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    menuContainer: { backgroundColor: 'white', margin: 16, borderRadius: 12, overflow: 'hidden' },
    menuItem: { padding: 16, alignItems: 'center' },
    menuText: { fontSize: 16 },
    deleteText: { color: 'red' },
    menuDivider: { height: 1, backgroundColor: '#F0F0F0' },
});

export default PostDetailScreen;
