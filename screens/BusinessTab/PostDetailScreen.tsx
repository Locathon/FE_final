import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const PostDetailScreen = ({ route }: any) => {
  const { title, content, images } = route.params || {
    title: '게시글 제목',
    content: '게시글 내용이 여기에 표시됩니다.',
    images: [],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      <View style={styles.imageContainer}>
        {images.map((uri: string, index: number) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
  },
});

export default PostDetailScreen;