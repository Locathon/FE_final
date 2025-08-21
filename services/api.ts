// C:\Users\mnb09\Desktop\Temp\services\api.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://3.35.27.124:8080';

const PUBLIC_ENDPOINTS = [
  '/api/members/login',
  '/api/members/register',
];

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!PUBLIC_ENDPOINTS.includes(endpoint)) {
    const storedToken = await AsyncStorage.getItem('jwt');
    if (storedToken) {
      headers.set('Authorization', `Bearer ${storedToken}`);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error("Received non-JSON response:", responseText);
        throw new Error(`서버로부터 잘못된 응답을 받았습니다 (Content-Type: ${contentType}). API 주소가 올바른지 확인해주세요.`);
    }

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `알 수 없는 서버 오류입니다. (상태: ${response.status})`;
      console.error(`API Error on ${endpoint}:`, JSON.stringify(responseData, null, 2));
      throw new Error(errorMessage);
    }

    // [핵심 수정] .data 속성 대신, 서버가 보내준 JSON 객체 전체를 반환합니다.
    return responseData;

  } catch (error) {
    if (error instanceof Error) {
        console.error(`Request to ${endpoint} failed:`, error.message);
        throw error;
    }
    throw new Error('네트워크 요청 중 알 수 없는 오류가 발생했습니다.');
  }
};
