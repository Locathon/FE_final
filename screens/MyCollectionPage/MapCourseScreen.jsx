import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const coursePoints = [
  {
    name: '운멜로 1호점',
    address: '수원시 팔달구 정조로 905',
    lat: 37.2848,
    lng: 127.0144,
  },
  {
    name: '방화수류정',
    address: '수원시 팔달구 정조로 910',
    lat: 37.2872,
    lng: 127.0131,
  },
  {
    name: '수원 전통문화관',
    address: '수원시 팔달구 정조로 915',
    lat: 37.2886,
    lng: 127.0120,
  },
];

export default function MapCourseScreen() {
  const navigation = useNavigation();

  const region = {
    latitude: coursePoints[0].lat,
    longitude: coursePoints[0].lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        {coursePoints.map((point, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: point.lat, longitude: point.lng }}
            title={point.name}
            description={point.address}
          />
        ))}
        <Polyline
          coordinates={coursePoints.map(p => ({ latitude: p.lat, longitude: p.lng }))}
          strokeColor="#FF6B6B"
          strokeWidth={4}
        />
      </MapView>
      <ScrollView style={styles.infoBox} contentContainerStyle={styles.infoContent}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.courseAuthor}>유은서</Text>
            <Text style={styles.courseTitle}>가족과 여행하기 좋은 힐링 코스</Text>
            <Text style={styles.courseSummary}>운멜로 - 방화수류정 - 수원전통문화관</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              navigation.navigate('EditCourseScreen', {
                course: {
                  title: '가족과 여행하기 좋은 힐링 코스',
                  author: '유은서',
                  points: coursePoints,
                },
              });
            }}
          >
            <Text style={styles.editButtonText}>수정하기</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 20 }} />
        <View style={styles.divider} />
        {coursePoints.map((point, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepLine}>
              <View style={styles.circle} />
              {index < coursePoints.length - 1 ? (
                <View style={styles.verticalLine} />
              ) : (
                <View style={styles.finalLineSpacer} />
              )}
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{point.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={16} color="#888" style={{ marginRight: 4 }} />
                <Text style={styles.stepAddress}>{point.address}</Text>
              </View>
              <Text style={styles.stepDistance}>🚶 도보 14분   🚲 자전거 8분</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: width,
    height: height * 0.45,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.65,
  },
  infoContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#888',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  courseAuthor: {
    fontSize: 14,
    color: '#888',
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 100,
    paddingBottom: 12,
  },
  stepLine: {
    alignItems: 'center',
    width: 24,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00B8FF',
    marginTop: 4,
  },
  verticalLine: {
    flex: 1,
    width: 3,
    backgroundColor: '#00B8FF',
    marginTop: 2,
    
  },
  finalLineSpacer: {
    width: 2,
    height: 24,
    backgroundColor: '#00B8FF',
  },
  stepContent: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  stepAddress: {
    fontSize: 15,
    color: '#888',
  },
  stepDistance: {
    fontSize: 15,
    color: '#333',
    marginTop: 4,
  },
  courseSummary: {
    fontSize: 15,
    color: '#888',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
});