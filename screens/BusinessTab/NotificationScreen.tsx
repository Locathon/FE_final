import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 임시 알림 데이터 (추후 API 연동)
const DUMMY_NOTIFICATIONS = [
  { id: '1', type: 'review', content: "'카페 온멜로'에 새로운 후기가 등록되었어요.", time: '5분 전', read: false },
  { id: '2', type: 'qa', content: "새로운 Q&A 질문이 도착했어요: '주차 가능한가요?'", time: '1시간 전', read: false },
  { id: '3', type: 'like', content: "회원님이 작성하신 '여름 신메뉴 출시' 소식을 5명이 좋아해요.", time: '3시간 전', read: true },
  { id: '4', type: 'review', content: "'카페 온멜로'에 새로운 후기가 등록되었어요.", time: '어제', read: true },
];

const NotificationItem = ({ item }: { item: typeof DUMMY_NOTIFICATIONS[0] }) => {
  const getIconName = () => {
    switch(item.type) {
      case 'review': return 'star-outline';
      case 'qa': return 'help-circle-outline';
      case 'like': return 'heart-outline';
      default: return 'notifications-outline';
    }
  }

  return (
    <TouchableOpacity style={[styles.itemContainer, !item.read && styles.unreadItem]}>
      <Ionicons name={getIconName()} size={24} color="#2F80ED" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.content}>{item.content}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
};


export default function NotificationScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>알림</Text>
            <View style={{ width: 24 }} />
        </View>
        <FlatList
            data={DUMMY_NOTIFICATIONS}
            renderItem={NotificationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    alignItems: 'center',
  },
  unreadItem: {
    backgroundColor: '#E7F1FD',
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
  },
  time: {
    fontSize: 12,
    color: '#828282',
    marginTop: 4,
  },
});
