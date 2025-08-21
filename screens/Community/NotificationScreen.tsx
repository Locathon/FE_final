import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

// 알림 타입 정의
type Notification = {
  id: string;
  type: 'comment' | 'like' | 'market';
  message: string;
  timestamp: string;
  read: boolean;
};

// 임시 알림 데이터
const DUMMY_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'comment', message: "'뚜벅이 여행가'님이 회원님의 게시물에 댓글을 남겼습니다.", timestamp: '10분 전', read: false },
  { id: '2', type: 'like', message: "'마을 이장님'님이 회원님의 게시물을 좋아합니다.", timestamp: '1시간 전', read: false },
  { id: '3', type: 'market', message: "새로운 '동네소식'이 등록되었습니다: 이번주 토요일, 행궁동 프리마켓 열려요!", timestamp: '3시간 전', read: true },
  { id: '4', type: 'comment', message: "'주차요정'님이 회원님의 게시물에 댓글을 남겼습니다.", timestamp: '5시간 전', read: true },
];

const NotificationScreen = () => {
  const navigation = useNavigation();

  const renderIcon = (type: 'comment' | 'like' | 'market') => {
    switch (type) {
      case 'comment':
        return <Ionicons name="chatbubbles" size={24} color="#2F80ED" />;
      case 'like':
        return <Ionicons name="heart" size={24} color="#EB5757" />;
      case 'market':
        return <Ionicons name="storefront" size={24} color="#27AE60" />;
      default:
        return <Ionicons name="notifications" size={24} color="#828282" />;
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={[styles.itemContainer, !item.read && styles.unread]}>
      <View style={styles.iconContainer}>{renderIcon(item.type)}</View>
      <View style={styles.textContainer}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>알림</Text>
      </View>
      <FlatList
        data={DUMMY_NOTIFICATIONS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  itemContainer: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  unread: { backgroundColor: '#E7F0FF' },
  iconContainer: { marginRight: 16 },
  textContainer: { flex: 1 },
  message: { fontSize: 15, lineHeight: 22 },
  timestamp: { fontSize: 12, color: '#828282', marginTop: 4 },
  separator: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 72 },
});

export default NotificationScreen;

