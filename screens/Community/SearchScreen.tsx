import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Post, posts } from '../../data/communityData'; // 중앙 데이터
import { CommunityStackParamList } from '../../navigation/CommunityNavigator';

type SearchScreenNavigationProp = NativeStackNavigationProp<CommunityStackParamList, 'Search'>;

// 검색 결과에 표시될 카드 (CommunityScreen의 카드와 유사)
const PostCard = ({ item, navigation }: { item: Post, navigation: SearchScreenNavigationProp }) => (
  <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PostDetail', { postId: item.id })}>
    <View style={styles.cardHeader}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View>
        <Text style={styles.authorName}>{item.author}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
  </TouchableOpacity>
);

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (query.trim() === '') {
      return [];
    }
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#828282" />
          <TextInput
            style={styles.input}
            placeholder="검색어를 입력하세요"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      </View>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard item={item} navigation={navigation} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {query.trim() === '' ? '무엇이든 검색해보세요.' : '검색 결과가 없습니다.'}
            </Text>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F2', borderRadius: 8, paddingHorizontal: 12, marginLeft: 16, },
  input: { flex: 1, height: 40, marginLeft: 8, fontSize: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#828282' },
  // 카드 스타일
  card: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  authorName: { fontWeight: 'bold' },
  timestamp: { fontSize: 12, color: '#828282' },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  content: { fontSize: 14, color: '#4F4F4F' },
});

export default SearchScreen;
