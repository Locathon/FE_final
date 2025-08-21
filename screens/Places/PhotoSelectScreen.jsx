import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PhotoSelectScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(new Set());
  const [photos, setPhotos] = useState([]);

  const toggleSelect = (id) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const onDone = () => {
    const selectedUris = photos
      .filter(photo => selected.has(photo.id))
      .map(photo => photo.uri);

    navigation.navigate('PlaceWrite', { photos: selectedUris });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '갤러리 접근을 허용해야 사진을 선택할 수 있습니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // iOS에서는 작동하지 않음
      quality: 1,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map((asset, index) => ({
        id: `picked-${Date.now()}-${index}`,
        uri: asset.uri,
      }));

      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);

      const newSelected = new Set(selected);
      newPhotos.forEach(photo => newSelected.add(photo.id));
      setSelected(newSelected);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>갤러리에서 사진 선택</Text>

      <TouchableOpacity
        style={styles.galleryButton}
        onPress={pickImage}
      >
        <Text style={styles.galleryButtonText}>갤러리 열기</Text>
      </TouchableOpacity>

      {photos.length > 0 ? (
        <FlatList
          data={photos}
          numColumns={3}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => {
            const isSelected = selected.has(item.id);
            return (
              <TouchableOpacity
                onPress={() => toggleSelect(item.id)}
                style={styles.photoWrapper}
                activeOpacity={0.7}
              >
                <Image source={{ uri: item.uri }} style={styles.photo} />
                {isSelected && (
                  <View style={styles.overlay}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>선택한 사진이 없습니다.</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.doneButton, { backgroundColor: selected.size > 0 ? '#4A90E2' : '#ccc' }]}
        onPress={onDone}
        disabled={selected.size === 0}
        activeOpacity={0.8}
      >
        <Text style={styles.doneButtonText}>선택 완료 ({selected.size})</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  galleryButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  galleryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  photoWrapper: {
    margin: 5,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    width: 100,
    height: 100,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.4)',
    top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  doneButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default PhotoSelectScreen;
