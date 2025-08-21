// C:/Users/mnb09/Desktop/Temp/data/courseData.ts

import { ImageSourcePropType } from 'react-native';

// --- 타입 정의 (기존 구조 유지) ---
export type Place = {
  id: string;
  name: string;
  category: string;
  address: string;
  coordinate: { latitude: number; longitude: number };
  description?: string;
  time?: string;
  thumbnail?: ImageSourcePropType;
};

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: ImageSourcePropType;
  author: string;
  likes: number;
  isMyCourse?: boolean;
};

export type CourseDetail = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  description: string;
  places: Place[];
  isMyCourse?: boolean;
  likes: number;
};

// --- 데이터 원본 ---
const initialCourseDetails: CourseDetail[] = [
    { id: 'rec1', title: '행궁동 맛집 완전정복', subtitle: '운멜로 → 방화수류정 → 수원전통문화관', author: '느린행궁러버', description: '행궁동의 숨겨진 맛집들을 탐방하는 최고의 코스입니다. 친구 또는 연인과 함께 즐거운 시간을 보내세요!', places: [ { id: 'p1', name: '운멜로', category: '음식점', address: '경기도 수원시 팔달구 신풍로63번길 3-2 1층', coordinate: { latitude: 37.281, longitude: 127.015 }, time: '도보 10분', thumbnail: require('../assets/images/unmelo.jpg') }, { id: 'p2', name: '방화수류정', category: '명소', address: '경기 수원시 팔달구 수원천로392번길 44-6', coordinate: { latitude: 37.288, longitude: 127.018 }, time: '도보 15분', thumbnail: require('../assets/images/banghwasuryujeong.jpg') }, { id: 'p3', name: '수원전통문화관', category: '문화시설', address: '경기 수원시 팔달구 정조로 893', coordinate: { latitude: 37.289, longitude: 127.013 }, thumbnail: require('../assets/images/suwon_culture_center.jpg') } ], likes: 120, isMyCourse: false },
    { id: 'rec2', title: '예술 감성 산책 코스', subtitle: '수원화성박물관 → 공방거리 → 아트스페이스', author: '행궁동전문가', description: '고요한 박물관에서 시작하여 활기찬 공방거리를 거쳐 현대적인 아트스페이스에서 마무리하는 예술적인 하루를 경험해보세요.', places: [ { id: 'p4', name: '수원화성박물관', category: '문화시설', address: '경기도 수원시 팔달구 창룡대로 21', coordinate: { latitude: 37.284, longitude: 127.020 }, time: '도보 5분', thumbnail: require('../assets/images/suwon_hwaseong_museum.jpg') }, { id: 'p5', name: '행궁동 공방거리', category: '명소', address: '경기도 수원시 팔달구 행궁로 18', coordinate: { latitude: 37.280, longitude: 127.013 }, time: '도보 12분', thumbnail: require('../assets/images/craft_street.jpg') }, { id: 'p6', name: '아트스페이스 광교', category: '미술관', address: '경기도 수원시 영통구 광교중앙로 140', coordinate: { latitude: 37.288, longitude: 127.051 }, thumbnail: require('../assets/images/art_space_gwanggyo.jpg') } ], likes: 98, isMyCourse: false },
    { id: 'rec3', title: '역사와 자연을 함께', subtitle: '플라잉수원 → 수원 시립 아이파크 미술관', author: '수원시민', description: '하늘에서 수원 화성을 조망하고, 현대 미술의 정수를 느껴보세요.', places: [ { id: 'p7', name: '플라잉수원', category: '체험', address: '경기도 수원시 팔달구 경수대로697번길 27', coordinate: { latitude: 37.279, longitude: 127.024 }, thumbnail: require('../assets/images/flying_suwon.jpg') }, { id: 'p8', name: '수원 시립 아이파크 미술관', category: '미술관', address: '경기 수원시 팔달구 정조로 833', coordinate: { latitude: 37.280, longitude: 127.012 }, thumbnail: require('../assets/images/ipark_museum.jpg') } ], likes: 76, isMyCourse: false },
];

// --- 가변 데이터 (let으로 선언하여 앱 사용 중 수정) ---
let courseDetailsData: CourseDetail[] = [...initialCourseDetails];

export let courseDetailsMap = new Map<string, CourseDetail>(
  courseDetailsData.map(course => [course.id, course])
);

// 모든 장소 목록 (중복 제거)
export let allPlaces: Place[] = Array.from(new Set(initialCourseDetails.flatMap(cd => cd.places).map(p => p.id))).map(id => initialCourseDetails.flatMap(cd => cd.places).find(p => p.id === id)!);

const courseDetailToSummary = (detail: CourseDetail): Course => ({
  id: detail.id,
  title: detail.title,
  subtitle: detail.subtitle,
  thumbnail: detail.places[0]?.thumbnail || require('../assets/images/default_thumbnail.png'),
  author: detail.author,
  likes: detail.likes,
  isMyCourse: detail.isMyCourse,
});

// --- 데이터 제공 변수 (항상 최신 데이터를 기반으로 계산됨) ---
export let allCourses: Course[] = courseDetailsData.map(courseDetailToSummary);
export let recommendedCourses: Course[] = courseDetailsData.filter(c => !c.isMyCourse).map(courseDetailToSummary);
export let myCourses: Course[] = courseDetailsData.filter(c => c.isMyCourse).map(courseDetailToSummary);
export let savedCourses: Course[] = [allCourses[0], allCourses[1]];

// --- 데이터 조작 함수 ---

const refreshSummaryLists = () => {
  allCourses = courseDetailsData.map(courseDetailToSummary);
  recommendedCourses = courseDetailsData.filter(c => !c.isMyCourse).map(courseDetailToSummary);
  myCourses = courseDetailsData.filter(c => c.isMyCourse).map(courseDetailToSummary);
  // `savedCourses`는 별도로 관리되므로 여기서는 건드리지 않음
};

// [기능 개선] 코스를 복사하여 "나의 코스"에 추가하는 함수
export const addMyCourse = (newCourseData: { title: string; places: Place[]; originalAuthor: string }) => {
    const newCourseId = `my_${Date.now()}`;
    const newSubtitle = newCourseData.places.map(p => p.name).join(' → ');

    const newCourseDetail: CourseDetail = {
        id: newCourseId,
        title: newCourseData.title,
        subtitle: newSubtitle,
        author: '나 (원본: ' + newCourseData.originalAuthor + ')',
        description: `${newCourseData.originalAuthor}님의 '${newCourseData.title}' 코스를 바탕으로 새로운 코스를 만들었어요!`,
        places: newCourseData.places,
        isMyCourse: true,
        likes: 0,
    };

    courseDetailsData.unshift(newCourseDetail);
    courseDetailsMap.set(newCourseId, newCourseDetail);
    refreshSummaryLists();
    
    // 새로 생성된 코스의 ID를 반환하여 상세 페이지로 바로 이동할 수 있게 함
    return newCourseId;
};


export const saveCourse = (courseData: { id?: string; title: string; description: string; places: Place[]; }) => {
  const newSubtitle = courseData.places.map(p => p.name).join(' → ');
  if (courseData.id) {
      const index = courseDetailsData.findIndex(c => c.id === courseData.id);
      if (index > -1) {
          const updatedDetail = { ...courseDetailsData[index], ...courseData, subtitle: newSubtitle };
          courseDetailsData[index] = updatedDetail;
          courseDetailsMap.set(courseData.id, updatedDetail);
      }
  } else {
      const newCourseId = `my_${Date.now()}`;
      const newCourseDetail: CourseDetail = {
          id: newCourseId,
          title: courseData.title,
          description: courseData.description,
          places: courseData.places,
          subtitle: newSubtitle,
          author: '나',
          likes: 0,
          isMyCourse: true,
      };
      courseDetailsData.unshift(newCourseDetail);
      courseDetailsMap.set(newCourseId, newCourseDetail);
  }
  refreshSummaryLists();
};

export const deleteCourse = (courseId: string) => {
  courseDetailsData = courseDetailsData.filter(c => c.id !== courseId);
  courseDetailsMap.delete(courseId);
  savedCourses = savedCourses.filter(c => c.id !== courseId);
  refreshSummaryLists();
};

export const toggleSaveCourse = (course: Course | CourseDetail) => {
    const index = savedCourses.findIndex(c => c.id === course.id);
    if (index > -1) {
        savedCourses.splice(index, 1);
    } else {
        const summaryCourse = allCourses.find(c => c.id === course.id);
        if (summaryCourse) {
            savedCourses.unshift(summaryCourse);
        }
    }
};
