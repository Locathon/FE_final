import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAuth } from '../contexts/AuthContext';
import TabNavigator from '../navigation/TabNavigator';
import UserTypeSelectionScreen from '../screens/Auth/UserTypeSelectionScreen';

// app/index.tsx는 더 이상 네비게이터가 아닙니다.
// 로그인 후 보여줄 화면을 결정하는 단순한 컴포넌트입니다.
export default function Index() {
  const { userType } = useAuth();
  const [isIntroFinished, setIsIntroFinished] = useState(false);

  if (!isIntroFinished) {
    return (
      <View style={styles.container}>
        <WebView
          originWhitelist={['*']}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                <style>
                  html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    background: #fff;
                    overflow: hidden;
                  }
                  dotlottie-player {
                    position: fixed;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    transform: scale(1.1);
                  }
                </style>
              </head>
              <body>
                <dotlottie-player
                  src="https://lottie.host/5552237f-d88b-4ed5-b26a-0b63f6f7dd3d/adBEAJJ2pM.lottie"
                  background="transparent"
                  speed="1.5"
                  autoplay
                ></dotlottie-player>
                <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.js"></script>
              </body>
              </html>
            `
          }}
          style={{ flex: 1 }}
          onLoadEnd={() => setTimeout(() => setIsIntroFinished(true), 3000)}
        />
      </View>
    );
  }

  // 백엔드로부터 받은 userType이 아직 visitor이면 유형 선택 화면을 보여줍니다.
  if (userType === 'visitor') {
    return <UserTypeSelectionScreen />;
  }

  // userType이 resident 또는 business_owner 등으로 설정되었다면,
  // 메인 탭 네비게이터를 보여줍니다.
  return <TabNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});