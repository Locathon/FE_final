export type User = {
  id: string;
  name: string;
  avatar: any; 
  bio: string;
};

// 변경점: 모든 이미지 경로가 '../assets/...'로 되어 있는지 재확인했습니다.
export const users: User[] = [
  { id: 'user001', name: '행궁동 전문가', avatar: require('../assets/images/avatar1.jpg'), bio: '행궁동의 모든 것을 사랑하는 로컬 큐레이터입니다.' },
  { id: 'user002', name: '마을 이장님', avatar: require('../assets/images/avatar2.jpg'), bio: '우리 동네 소식은 저에게 물어보세요!' },
  { id: 'user003', name: '뚜벅이 여행가', avatar: require('../assets/images/avatar3.jpg'), bio: '두 발로 행궁동의 숨은 매력을 찾아다닙니다.' },
  { id: 'user004', name: '주차요정', avatar: require('../assets/images/avatar4.jpg'), bio: '행궁동 주차, 더 이상 어렵지 않아요.' },
];

export const currentUser: User = users[0];
