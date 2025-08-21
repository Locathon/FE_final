// C:\Users\mnb09\Desktop\Temp\screens\Business\BusinessProfileScreen.tsx

import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BusinessProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
        {/* [문제 #4 해결] 이미지를 디저트 카페에 어울리는 로컬 에셋으로 변경 */}
        <Image source={require('../../assets/images/desserts/cafe_logo.png')} style={styles.image} />
        <Text style={styles.name}>행궁 디저트 연구소</Text>
        <Text style={styles.description}>
            매일 아침 신선한 재료로 만드는 수제 디저트와 스페셜티 커피를 즐겨보세요.
        </Text>
        <View style={styles.infoBox}>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>운영 시간</Text>
                <Text style={styles.info}>매일 11:00 ~ 21:00</Text>
            </View>
             <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>휴무일</Text>
                <Text style={styles.info}>월요일</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>위치</Text>
                <Text style={styles.info}>경기도 수원시 행궁동 238-234</Text>
            </View>
        </View>
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>프로필 수정하기</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#EAEAEA'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
    lineHeight: 24,
  },
  infoBox: {
      width: '100%',
      backgroundColor: '#F7F7F7',
      borderRadius: 12,
      padding: 20,
  },
  infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#EAEAEA'
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 30,
    width: '100%',
    backgroundColor: '#2F80ED',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  }
});
