export type Comment = {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  likes: number;
  iLiked: boolean;
};

export type Post = {
  id:string;
  userId: string;
  category: '잡담' | '질문' | '경로' | '동네소식';
  title: string;
  content: string;
  timestamp: string;
  images?: any[];
  likes: number;
  iLiked: boolean;
  commentsCount: number;
  comments: Comment[];
  distance: number;
  createdAt: Date;
  isRecommended?: boolean;
};

// 변경점: 모든 이미지 경로가 '../assets/...'로 되어 있는지 재확인했습니다.
export const posts: Post[] = [
  {
    id: 'post1',
    userId: 'user001',
    category: '잡담',
    title: '요즘 행궁동에서 가장 핫한 카페',
    content: '저는 개인적으로 온멜로 추천합니다! 분위기가 정말 좋아요. 특히 디저트 종류가 다양하고 맛있어서 자주 가게 되네요. 여러분의 최애 카페는 어디인가요? 공유해주세요!',
    timestamp: '5분 전',
    images: [require('../assets/images/onmelo_food.jpg')],
    likes: 22,
    iLiked: false,
    commentsCount: 2,
    comments: [
        { id: 'c1', userId: 'user003', content: '오 저도 온멜로 좋아해요! 인정입니다.', timestamp: '3분 전', likes: 2, iLiked: false},
        { id: 'c2', userId: 'user004', content: '거기 주차는 좀 힘들지 않나요? ㅠㅠ', timestamp: '1분 전', likes: 0, iLiked: false},
    ],
    distance: 0.5,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    isRecommended: true,
  },
  {
    id: 'post2',
    userId: 'user002',
    category: '동네소식',
    title: '이번주 토요일, 행궁동 프리마켓 열려요!',
    content: '화성행궁 광장에서 오전 11시부터 오후 5시까지 프리마켓이 열린다고 합니다. 다양한 수공예품이랑 먹거리가 많으니 시간되시는 분들은 구경가보세요!',
    timestamp: '2시간 전',
    images: [require('../assets/images/freemarket.jpg')],
    likes: 45,
    iLiked: true,
    commentsCount: 1,
    comments: [
        { id: 'c3', userId: 'user001', content: '오 좋은 정보 감사합니다!', timestamp: '1시간 전', likes: 5, iLiked: true},
    ],
    distance: 1.2,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'post3',
    userId: 'user003',
    category: '경로',
    title: '사진 찍기 좋은 행궁동 산책 코스',
    content: '행리단길에서 시작해서 방화수류정까지 걷는 코스입니다. 가는 길에 예쁜 카페랑 소품샵이 많아서 사진 찍기 정말 좋아요. 마지막에 방화수류정에서 보는 노을은 필수!',
    timestamp: '8시간 전',
    images: [require('../assets/images/banghwasuryujeong.jpg')],
    likes: 78,
    iLiked: false,
    commentsCount: 0,
    comments: [],
    distance: 0.8,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    isRecommended: true,
  },
    {
    id: 'post4',
    userId: 'user004',
    category: '질문',
    title: '행궁동 근처에 주차할만한 곳 있을까요?',
    content: '이번 주말에 차를 가지고 가려는데, 다들 주차는 어디에 하시나요? 유료 주차장 정보라도 좋습니다! 장안동 공영주차장이 제일 나을까요?',
    timestamp: '1일 전',
    images: [require('../assets/images/parking.jpg')],
    likes: 5,
    iLiked: false,
    commentsCount: 0,
    comments: [],
    distance: 3.0,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];
