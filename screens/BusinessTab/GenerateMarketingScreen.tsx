import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const snsList = [
  { label: '네이버 스토어', icon: require('../../assets/images/naver.png') },
  { label: 'X(트위터)', icon: require('../../assets/images/x.png') },
  { label: '스레드', icon: require('../../assets/images/threads.png') },
  { label: '인스타그램', icon: require('../../assets/images/instagram.png') },
];

const GenerateMarketingScreen = () => {
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [sns, setSns] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [loadingDots, setLoadingDots] = useState('');
  const { width } = useWindowDimensions();

  const isActive = Boolean(storeName.trim() && storeDescription.trim() && sns);

  useEffect(() => {
    if (aiStatus === 'idle') {
      setLoadingDots('');
    }
    if (aiStatus === 'loading') {
      const interval = setInterval(() => {
        setLoadingDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [aiStatus]);

  const handleGenerate = async () => {
    if (!isActive) return;
    setAiStatus('loading');
    console.log('AI 요청 바디:', {
      originalText: storeDescription,
      storeName,
      sns,
    });
    const response = await fetch('http://3.35.27.124:8080/merchant/style-transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalText: storeDescription,
        storeName,
        sns,
      }),
    });
    const data = await response.json();
    setGeneratedText(data.transformed);
    setAiStatus('done');
  };

  const handleCopy = () => {
    if (aiStatus !== 'done') return;
    const plainText = generatedText.replace(/<[^>]+>/g, '').replace(/<br\s*\/?>/gi, '\n');
    Clipboard.setStringAsync(plainText);
  };

  const getTextLength = aiStatus === 'done'
    ? generatedText.replace(/<[^>]+>/g, '').length
    : storeDescription.length;
  const maxLength = 150;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* <Text style={styles.headerTitle}>AI 글쓰기</Text> */}
        <Text style={styles.guideTitle}>AI를 활용해 홍보용 글을 써보세요</Text>
        <Text style={styles.guideDesc}>
          원하는 문구를 작성하고 업로드할 SNS를 선택하면,{"\n"}AI가 SNS의 성격에 맞게 글을 변환해줘요.
        </Text>

        <Text style={styles.label}>스토어 이름</Text>
        <TextInput
          style={styles.input}
          value={storeName}
          onChangeText={setStoreName}
          placeholder="예) 레몬트리"
          placeholderTextColor="#C1C5CC"
        />

        <Text style={styles.label}>홍보 글쓰기</Text>
        <View style={styles.textareaWrap}>
          {aiStatus === 'done' ? (
            <ScrollView style={{ maxHeight: 120 }}>
              <RenderHtml
                contentWidth={width - 40}
                source={{ html: `<div>${generatedText.replace(/\n/g, '<br />')}</div>` }}
                tagsStyles={{
                  span: { color: '#286FFD', fontWeight: 'bold' },
                  div: { fontSize: 15, color: '#222' },
                }}
              />
            </ScrollView>
          ) : aiStatus === 'loading' ? (
            <View style={[styles.textarea, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 80, textAlign: 'center', color: '#888' }}>{loadingDots}</Text>
            </View>
          ) : (
            <TextInput
              style={styles.textarea}
              value={storeDescription}
              onChangeText={text => {
                setAiStatus('idle');
                setStoreDescription(text);
                setGeneratedText('');
              }}
              placeholder="AI로 변환하고 싶은 홍보용 문구를 작성해주세요."
              placeholderTextColor="#C1C5CC"
              multiline
              editable={aiStatus !== 'done'}
              maxLength={maxLength}
              scrollEnabled={true}
            />
          )}
          <View style={styles.textareaBottom}>
            <Text style={[styles.lengthCount, { color: getTextLength === maxLength ? '#F66' : '#B2B8C3' }]}>
              {getTextLength}/{maxLength}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleCopy}
          activeOpacity={aiStatus === 'done' ? 0.85 : 1}
          disabled={aiStatus !== 'done'}
          style={[
            styles.copyButton,
            aiStatus === 'done' ? styles.copyButtonActive : styles.copyButtonInactive,
          ]}
        >
          <Text style={styles.copyButtonText}>복사하기</Text>
        </TouchableOpacity>

        <Text style={styles.label}>SNS</Text>
        <View style={styles.snsContainer}>
          {snsList.map((item) => {
            const selected = sns === item.label;
            return (
              <View key={item.label} style={styles.snsItemWrapper}>
                <TouchableOpacity
                  style={[styles.snsCircle, selected && styles.snsCircleSelected]}
                  onPress={() => setSns(item.label)}
                  activeOpacity={0.8}
                >
                  <Image source={item.icon} style={styles.snsIcon} />
                </TouchableOpacity>
                <Text style={[styles.snsLabel, selected && styles.snsLabelSelected]}>
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.bottomButtonWrapper}>
        <TouchableOpacity
          style={[
            styles.bottomButton,
            isActive ? styles.bottomButtonActive : styles.bottomButtonInactive,
          ]}
          onPress={handleGenerate}
          activeOpacity={isActive ? 0.85 : 1}
          disabled={!isActive}
        >
          <Text style={styles.bottomButtonText}>
            {aiStatus === 'done' ? '다시 변환' : 'AI로 변환'}
          </Text>
          <Image
            source={
              aiStatus === 'done'
                ? require('../../assets/images/regenerate.png')
                : require('../../assets/images/ai_transition.png')
            }
            style={styles.bottomButtonIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
    marginTop: 8,
    color: '#222',
    alignSelf: 'flex-start',
  },
  guideTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
  },
  guideDesc: {
    fontSize: 13,
    color: '#858997',
    marginBottom: 18,
    lineHeight: 18,
  },
  label: {
    marginTop: 16,
    marginBottom: 7,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ECECEC',
    backgroundColor: '#F6F8FA',
    borderRadius: 10,
    padding: 13,
    fontSize: 15,
    marginBottom: 5,
    color: '#222',
  },
  textareaWrap: {
    borderWidth: 1,
    borderColor: '#ECECEC',
    backgroundColor: '#F6F8FA',
    borderRadius: 10,
    marginBottom: 2,
    paddingBottom: 3,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
    fontSize: 15,
    padding: 12,
    color: '#222',
  },
  textareaBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 6,
    marginBottom: 3,
    marginTop: -2,
  },
  lengthCount: {
    fontSize: 12,
    marginRight: 16,
    fontWeight: '500',
  },
  copyBtn: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 2,
  },
  copyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  copyButtonActive: {
    backgroundColor: '#222',
  },
  copyButtonInactive: {
    backgroundColor: '#E1E4E9',
  },
  copyButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  snsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 5,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  snsItemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
  },
  snsCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#DADDE3',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  snsCircleSelected: {
    backgroundColor: '#20A7FF',
    borderColor: '#20A7FF',
  },
  snsIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  snsLabel: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
  },
  snsLabelSelected: {
    fontWeight: '600',
    color: '#20A7FF',
  },
  bottomButtonWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  bottomButton: {
    flexDirection: 'row',
    minWidth: 340, // 기존보다 넓게 수정
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00000033',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
    gap: 8,
  },
  bottomButtonActive: {
    backgroundColor: '#222',
  },
  bottomButtonInactive: {
    backgroundColor: '#E1E4E9',
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  bottomButtonIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: '#fff', // 검정 배경일 때 아이콘이 보이도록 흰색으로 설정
  },
});

export default GenerateMarketingScreen;