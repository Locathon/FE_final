import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { STYLES } from '../../constants/styles';
import { useAuth } from '../../contexts/AuthContext';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
};

type Activity = {
  id: string;
  type: 'place_visit' | 'course_complete' | 'post_create' | 'review_write';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
};

type Statistic = {
  label: string;
  value: string;
  icon: string;
  color: string;
};

type MenuItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  onPress: () => void;
  count?: number;
};

const MyPageScreen = () => {
  const navigation = useNavigation<any>();
  const { userType, logout, isLoggedIn } = useAuth();
  
  const [userProfile, setUserProfile] = useState({
    name: '사용자',
    email: 'user@example.com',
    avatar: require('../../assets/images/default-profile.png'),
    level: 5,
    experience: 1250,
    nextLevelExp: 2000,
    userId: 'ID12340808',
  });
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);

  // 업적 데이터
  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: '첫 방문',
      description: '첫 번째 장소를 방문하세요',
      icon: 'location',
      isUnlocked: true,
      progress: 1,
      maxProgress: 1,
    },
    {
      id: '2',
      title: '코스 완주자',
      description: '5개의 코스를 완주하세요',
      icon: 'flag',
      isUnlocked: false,
      progress: 2,
      maxProgress: 5,
    },
    {
      id: '3',
      title: '리뷰 마스터',
      description: '10개의 리뷰를 작성하세요',
      icon: 'star',
      isUnlocked: false,
      progress: 7,
      maxProgress: 10,
    },
    {
      id: '4',
      title: '커뮤니티 활성화',
      description: '20개의 게시물을 작성하세요',
      icon: 'chatbubbles',
      isUnlocked: false,
      progress: 15,
      maxProgress: 20,
    },
  ]);

  // 활동 내역
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'place_visit',
      title: '수원 화성 방문',
      description: '수원 화성을 방문했습니다',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
      icon: 'location',
    },
    {
      id: '2',
      type: 'course_complete',
      title: '행궁동 카페 투어 완주',
      description: '행궁동 카페 투어 코스를 완주했습니다',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
      icon: 'flag',
    },
    {
      id: '3',
      type: 'post_create',
      title: '새 게시물 작성',
      description: '커뮤니티에 새 게시물을 작성했습니다',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
      icon: 'chatbubble',
    },
  ]);

  // 통계 데이터
  const [statistics] = useState<Statistic[]>([
    {
      label: '방문한 장소',
      value: '12',
      icon: 'location',
      color: STYLES.COLORS.PRIMARY,
    },
    {
      label: '완주한 코스',
      value: '3',
      icon: 'flag',
      color: STYLES.COLORS.SUCCESS,
    },
    {
      label: '작성한 리뷰',
      value: '8',
      icon: 'star',
      color: STYLES.COLORS.WARNING,
    },
    {
      label: '게시물',
      value: '15',
      icon: 'chatbubble',
      color: STYLES.COLORS.SECONDARY,
    },
  ]);

  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [])
  );

  const loadUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        // API 호출로 사용자 프로필 로드
        // setUserProfile(response.data);
      }
    } catch (_err) {
      // 기본값 사용
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      '로그아웃',
      '정말로 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '계정 삭제',
      '정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            // 계정 삭제 로직
            Alert.alert('삭제 완료', '계정이 삭제되었습니다.');
          },
        },
      ]
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, { backgroundColor: item.iconColor }]}>
          <Ionicons name={item.icon as any} size={20} color="#fff" />
        </View>
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {item.count !== undefined && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{item.count}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <View style={[styles.achievementItem, !item.isUnlocked && styles.lockedAchievement]}>
      <View style={styles.achievementIcon}>
        <Ionicons 
          name={item.icon as any} 
          size={24} 
          color={item.isUnlocked ? STYLES.COLORS.SUCCESS : '#ccc'} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={[
          styles.achievementTitle,
          !item.isUnlocked && styles.lockedText
        ]}>
          {item.title}
        </Text>
        <Text style={[
          styles.achievementDescription,
          !item.isUnlocked && styles.lockedText
        ]}>
          {item.description}
        </Text>
        <View style={styles.achievementProgress}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(item.progress / item.maxProgress) * 100}%`,
                  backgroundColor: item.isUnlocked ? STYLES.COLORS.SUCCESS : '#ccc'
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {item.progress}/{item.maxProgress}
          </Text>
        </View>
      </View>
      {item.isUnlocked && (
        <View style={styles.unlockBadge}>
          <Ionicons name="checkmark-circle" size={20} color={STYLES.COLORS.SUCCESS} />
        </View>
      )}
    </View>
  );

  const renderActivity = ({ item }: { item: Activity }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: getActivityColor(item.type) }]}>
        <Ionicons name={item.icon as any} size={16} color="#fff" />
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTime}>
          {formatTimeAgo(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'place_visit': return STYLES.COLORS.PRIMARY;
      case 'course_complete': return STYLES.COLORS.SUCCESS;
      case 'post_create': return STYLES.COLORS.SECONDARY;
      case 'review_write': return STYLES.COLORS.WARNING;
      default: return STYLES.COLORS.GRAY;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  // 기존 기능 + 새로운 기능 통합된 메뉴
  const menuItems: MenuItem[] = [
    // 기존 기능들 (복원)
    {
      id: 'my-courses',
      title: '내가 기록한 코스',
      subtitle: '내가 만든 코스와 저장한 코스',
      icon: 'map-outline',
      iconColor: STYLES.COLORS.PRIMARY,
      count: 5,
      onPress: () => navigation.navigate('MyCourses'),
    },
    {
      id: 'my-places',
      title: '내가 기록한 장소',
      subtitle: '내가 등록한 장소와 즐겨찾기',
      icon: 'location-outline',
      iconColor: STYLES.COLORS.SUCCESS,
      count: 12,
      onPress: () => navigation.navigate('MyPlaces'),
    },
    {
      id: 'my-reviews',
      title: '내가 남긴 후기',
      subtitle: '내가 작성한 리뷰와 평가',
      icon: 'chatbubble-ellipses-outline',
      iconColor: STYLES.COLORS.WARNING,
      count: 8,
      onPress: () => navigation.navigate('MyReviews'),
    },
    {
      id: 'ResidentAuth',
      title: '주민 인증',
      subtitle: '주민 인증 및 신원 확인',
      icon: 'shield-checkmark-outline',
      iconColor: '#4CAF50',
      onPress: () => navigation.navigate('ResidentAuth'),
    },
    {
      id: 'settings',
      title: '설정',
      subtitle: '앱 설정과 개인정보',
      icon: 'settings-outline',
      iconColor: '#666',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: 'guide',
      title: '이용 가이드',
      subtitle: '앱 사용법 및 도움말',
      icon: 'book-outline',
      iconColor: '#9C27B0',
      onPress: () => navigation.navigate('Guide'),
    },
    {
      id: 'terms',
      title: '이용약관 및 정책',
      subtitle: '서비스 이용약관과 개인정보처리방침',
      icon: 'document-text-outline',
      iconColor: '#607D8B',
      onPress: () => navigation.navigate('Terms'),
    },
    
    // 새로운 기능들 (추가)
    {
      id: 'achievements',
      title: '업적',
      subtitle: '달성한 업적과 진행 상황',
      icon: 'trophy',
      iconColor: '#FFD700',
      onPress: () => setShowAchievementsModal(true),
    },
    {
      id: 'activities',
      title: '활동 내역',
      subtitle: '최근 활동과 기록',
      icon: 'time',
      iconColor: STYLES.COLORS.GRAY,
      onPress: () => setShowActivitiesModal(true),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 프로필 헤더 */}
      <View style={styles.profileHeader}>
        <TouchableOpacity 
          style={styles.profileImageContainer}
          onPress={() => setShowProfileModal(true)}
        >
          <Image source={userProfile.avatar} style={styles.profileImage} />
          <View style={styles.editIcon}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userId}>{userProfile.userId}</Text>
          <View style={styles.userTypeBadge}>
            <Text style={styles.userTypeText}>
              {userType === 'resident' ? '주민' : '소상공인'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={20} color={STYLES.COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* 레벨 및 경험치 */}
      <View style={styles.levelSection}>
        <View style={styles.levelInfo}>
          <Text style={styles.levelText}>Level {userProfile.level}</Text>
          <Text style={styles.experienceText}>
            {userProfile.experience} / {userProfile.nextLevelExp} EXP
          </Text>
        </View>
        <View style={styles.levelProgress}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(userProfile.experience / userProfile.nextLevelExp) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* 통계 카드 */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>활동 통계</Text>
        <View style={styles.statsGrid}>
          {statistics.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                <Ionicons name={stat.icon as any} size={20} color="#fff" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 메뉴 목록 */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>메뉴</Text>
        <FlatList
          data={menuItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* 로그아웃 및 계정 삭제 */}
      <View style={styles.accountSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          <Text style={styles.deleteAccountButtonText}>계정 삭제</Text>
        </TouchableOpacity>
      </View>

      {/* 프로필 편집 모달 */}
      <Modal visible={showProfileModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowProfileModal(false)}>
              <Text style={styles.closeButton}>취소</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>프로필 편집</Text>
            <TouchableOpacity>
              <Text style={styles.saveButton}>저장</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>프로필 정보를 수정할 수 있습니다.</Text>
            {/* 프로필 편집 폼 */}
          </View>
        </SafeAreaView>
      </Modal>

      {/* 업적 모달 */}
      <Modal visible={showAchievementsModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAchievementsModal(false)}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>업적</Text>
            <View style={{ width: 50 }} />
          </View>
          
          <View style={styles.modalContent}>
            <FlatList
              data={achievements}
              renderItem={renderAchievement}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* 활동 내역 모달 */}
      <Modal visible={showActivitiesModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowActivitiesModal(false)}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>활동 내역</Text>
            <View style={{ width: 50 }} />
          </View>
          
          <View style={styles.modalContent}>
            <FlatList
              data={activities}
              renderItem={renderActivity}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* 설정 모달 */}
      <Modal visible={showSettingsModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>설정</Text>
            <View style={{ width: 50 }} />
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>앱 설정과 개인정보를 관리할 수 있습니다.</Text>
            {/* 설정 옵션들 */}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  
  // 프로필 헤더
  profileHeader: { 
    backgroundColor: '#fff', 
    padding: 20, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  profileImageContainer: { position: 'relative' },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  editIcon: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: STYLES.COLORS.PRIMARY, 
    borderRadius: 12, 
    padding: 4 
  },
  profileInfo: { flex: 1, marginLeft: 16 },
  userName: { fontSize: 20, fontWeight: '700', color: '#1c1c1e', marginBottom: 4 },
  userId: { fontSize: 14, color: '#666', marginBottom: 8 },
  userTypeBadge: { 
    backgroundColor: STYLES.COLORS.PRIMARY, 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 12, 
    alignSelf: 'flex-start' 
  },
  userTypeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  editProfileButton: { padding: 8 },
  
  // 레벨 섹션
  levelSection: { 
    backgroundColor: '#fff', 
    marginTop: 16, 
    padding: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#f0f0f0' 
  },
  levelInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  levelText: { fontSize: 16, fontWeight: '600', color: '#1c1c1e' },
  experienceText: { fontSize: 14, color: '#666' },
  levelProgress: { marginBottom: 8 },
  progressBar: { 
    height: 8, 
    backgroundColor: '#f1f3f4', 
    borderRadius: 4, 
    overflow: 'hidden' 
  },
  progressFill: { 
    height: '100%', 
    backgroundColor: STYLES.COLORS.PRIMARY, 
    borderRadius: 4 
  },
  
  // 통계 섹션
  statsSection: { 
    backgroundColor: '#fff', 
    marginTop: 16, 
    padding: 20 
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1c1c1e', marginBottom: 16 },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  statCard: { 
    width: '48%', 
    backgroundColor: '#f8f9fa', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 12 
  },
  statIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8 
  },
  statValue: { fontSize: 24, fontWeight: '700', color: '#1c1c1e', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#666', textAlign: 'center' },
  
  // 메뉴 섹션
  menuSection: { 
    backgroundColor: '#fff', 
    marginTop: 16, 
    padding: 20 
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16 
  },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#1c1c1e', marginBottom: 2 },
  menuSubtitle: { fontSize: 14, color: '#666' },
  menuItemRight: { flexDirection: 'row', alignItems: 'center' },
  countBadge: { 
    backgroundColor: STYLES.COLORS.PRIMARY, 
    borderRadius: 12, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    marginRight: 8 
  },
  countText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  
  // 계정 섹션
  accountSection: { 
    backgroundColor: '#fff', 
    marginTop: 16, 
    padding: 20 
  },
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  logoutButtonText: { 
    color: '#FF3B30', 
    fontSize: 16, 
    fontWeight: '600', 
    marginLeft: 12 
  },
  deleteAccountButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16 
  },
  deleteAccountButtonText: { 
    color: '#FF3B30', 
    fontSize: 16, 
    fontWeight: '600', 
    marginLeft: 12 
  },
  
  // 모달 스타일
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  closeButton: { color: '#666', fontSize: 16 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#1c1c1e' },
  saveButton: { color: STYLES.COLORS.PRIMARY, fontSize: 16, fontWeight: '600' },
  modalContent: { flex: 1, padding: 20 },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  
  // 업적 스타일
  achievementItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#f8f9fa', 
    borderRadius: 12, 
    marginBottom: 12 
  },
  lockedAchievement: { opacity: 0.6 },
  achievementIcon: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#f0f0f0', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16 
  },
  achievementInfo: { flex: 1 },
  achievementTitle: { fontSize: 16, fontWeight: '600', color: '#1c1c1e', marginBottom: 4 },
  achievementDescription: { fontSize: 14, color: '#666', marginBottom: 8 },
  lockedText: { color: '#999' },
  achievementProgress: { flexDirection: 'row', alignItems: 'center' },
  progressText: { fontSize: 12, color: '#666', marginLeft: 8 },
  unlockBadge: { marginLeft: 12 },
  
  // 활동 내역 스타일
  activityItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#f8f9fa', 
    borderRadius: 12, 
    marginBottom: 12 
  },
  activityIcon: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16 
  },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 16, fontWeight: '600', color: '#1c1c1e', marginBottom: 4 },
  activityDescription: { fontSize: 14, color: '#666', marginBottom: 4 },
  activityTime: { fontSize: 12, color: '#999' },
});

export default MyPageScreen;
