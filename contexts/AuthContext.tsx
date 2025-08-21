// C:\Users\mnb09\Desktop\Temp\contexts\AuthContext.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';

type UserType = 'resident' | 'business_owner' | 'admin' | 'visitor';

// [핵심 수정] AuthContextType에서 loginAsGuest 타입을 삭제합니다.
interface AuthContextType {
  isLoggedIn: boolean;
  userType: UserType;
  isLoading: boolean;
  login: (jwt: string, type: UserType) => Promise<void>;
  logout: () => Promise<void>;
  selectUserType: (type: UserType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>('visitor');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (jwt: string, type: UserType) => {
    try {
      await AsyncStorage.setItem('jwt', jwt);
      await AsyncStorage.setItem('userType', type);
      setIsLoggedIn(true);
      setUserType(type);
    } catch (e) {
      console.error("AsyncStorage에 토큰 저장 실패", e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwt');
      await AsyncStorage.removeItem('userType');
      setIsLoggedIn(false);
      setUserType('visitor');
    } catch (e) {
        console.error("AsyncStorage에서 토큰 삭제 실패", e);
    }
  };

  // [핵심 수정] loginAsGuest 함수를 완전히 삭제합니다.
  
  const selectUserType = async (type: UserType) => {
    if (type === 'business_owner' || type === 'resident') {
        try {
            await AsyncStorage.setItem('userType', type);
            setUserType(type);
        } catch (e) {
            console.error("AsyncStorage에 사용자 유형 저장 실패", e);
        }
    }
  };

  const value = {
    isLoggedIn,
    userType,
    isLoading,
    login,
    logout,
    selectUserType,
    // [핵심 수정] value 객체에서 loginAsGuest를 삭제합니다.
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
