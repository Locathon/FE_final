// 로거 유틸리티
export const logger = {
  error: (message: string, error?: any) => {
    if (__DEV__) {
      console.error(message, error);
    }
  },
  warn: (message: string, data?: any) => {
    if (__DEV__) {
      console.warn(message, data);
    }
  },
  info: (message: string, data?: any) => {
    if (__DEV__) {
      console.log(message, data);
    }
  },
};

// 메시지 표시 유틸리티 (Alert 대체)
export const showErrorMessage = (title: string, message: string) => {
  // React Native의 Alert를 사용하거나 커스텀 토스트 메시지 구현
  console.error(`${title}: ${message}`);
};

export const showSuccessMessage = (title: string, message: string) => {
  // 성공 메시지 표시 로직
  console.log(`${title}: ${message}`);
};
