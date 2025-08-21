import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { Post, posts } from '../../data/communityData';
import { users } from '../../data/userData';
import { CommunityStackParamList } from '../../navigation/CommunityNavigator';

type UserProfileRouteProp = RouteProp<CommunityStackParamList, 'UserProfile'>;
type UserProfileNavigationProp = NativeStackNavigationProp<CommunityStackParamList, 'UserProfile'>;

const UserProfileScreen = () => {
  const navigation = useNavigation<UserProfileNavigationProp>();
  const route = useRoute<UserProfileRouteProp>();
  const { userId } = route.params;

  const user = users.find(u => u.id === userId);
  const userPosts = posts.filter(p => p.userId === userId);

  // 변경점: 렌더링 함수를 컴포넌트 내부에 정의합니다.
  const renderPostCard = ({ item }: { item: Post }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => navigation.push('PostDetail', { postId: item.id })}>
            {item.images && item.images.length > 0 && 
                <Image source={item.images[0]} style={styles.cardImage} />
            }
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardText} numberOfLines={2}>{item.content}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.cardTimestamp}>{item.timestamp}</Text>
                    <View style={styles.cardActions}>
                        <Ionicons name="heart-outline" size={14} color="#828282" />
                        <Text style={styles.actionText}>{item.likes}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
  };


  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>사용자 정보를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.name}</Text>
        <View style={{width: 24}} />
      </View>
      
      <FlatList
        data={userPosts}
        keyExtractor={item => item.id}
        // 변경점: 새로 정의한 렌더링 함수를 사용합니다.
        renderItem={renderPostCard}
        ListHeaderComponent={
          <View style={styles.profileSection}>
            <Image source={user.avatar} style={styles.profileAvatar} />
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileBio}>{user.bio}</Text>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>작성한 게시물</Text>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    profileSection: { alignItems: 'center', paddingVertical: 24 },
    profileAvatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
    profileName: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
    profileBio: { fontSize: 15, color: '#4F4F4F', textAlign: 'center', marginBottom: 24 },
    divider: { height: 8, backgroundColor: '#F2F2F2', width: '120%', marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 8 },
    // 카드 스타일
    card: { flexDirection: 'row', backgroundColor: '#F9F9F9', borderRadius: 12, padding: 12, marginBottom: 12 },
    cardImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
    cardContent: { flex: 1, justifyContent: 'space-between' },
    cardTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
    cardText: { fontSize: 13, color: '#4F4F4F', marginBottom: 8 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTimestamp: { fontSize: 12, color: '#828282' },
    cardActions: { flexDirection: 'row', alignItems: 'center' },
    actionText: { marginLeft: 4, fontSize: 12, color: '#828282' },
});

export default UserProfileScreen;
