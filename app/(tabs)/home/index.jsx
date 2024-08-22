import React, { useState, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import axios from 'axios';
import ProfileCard from '../../../components/ProfileCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileModal from '../../../components/ProfileModal';
import { useRouter } from 'expo-router';
import HomeHeader from '../../../components/HomeHeader';

const { width } = Dimensions.get('screen');

const Home = () => {
  const [profiles, setProfiles] = useState([]);
  const [connectedProfileData, setConnectedProfileData] = useState(null);
  const [filteredProfiles, setFilteredProfiles] = useState([]); // State to store filtered profiles
  const [loading, setLoading] = useState(true);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState(null);
  const [swiperKey, setSwiperKey] = useState(0);

  const router = useRouter();

  useEffect(() => {
    // Show the loading overlay for 1.5 seconds
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    fetchUserId();
    fetchProfiles();
    fetchFilters();
  }, []);

  const fetchUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    setLoggedUserId(id);
  };

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(
        'http://192.168.10.10:3500/api/profiles'
      );
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const fetchFilters = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!userId || !token) {
        Alert.alert('Auth Error');
        return;
      } else {
        const userResponse = await axios.get(
          `http://192.168.10.10:3500/api/users/${userId}`,
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
        if (userResponse.data) {
          setConnectedProfileData(userResponse.data);
        }
        if (userResponse.data.filters) {
          const filterResponse = await axios.get(
            `http://192.168.10.10:3500/api/filters/${userResponse.data.filters}`,
            {
              headers: {
                'x-auth-token': token,
              },
            }
          );
          if (filterResponse) {
            setFilters(filterResponse.data);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching filters:', error.message);
    }
  };

  // Apply filters whenever profiles or filters change
  useEffect(() => {
    const applyFilters = () => {
      if (!filters) {
        setFilteredProfiles(
          profiles.filter((profile) => profile._id !== loggedUserId)
        );
        return;
      }

      const filtered = profiles
        .filter((profile) => profile && profile._id !== loggedUserId)
        .filter((profile) => {
          const matchesAge =
            (profile.age >= filters.ageRange[0] &&
              profile.age <= filters.ageRange[1]) ||
            profile.age === undefined;
          return matchesAge;
        });

      setFilteredProfiles(filtered);
    };

    applyFilters();
  }, [profiles, filters, loggedUserId]);

  const handleCardPress = (profile) => {
    setSelectedProfile(profile);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleFiltersApplied = async () => {
    setLoading(true);
    await fetchFilters();
    await fetchProfiles();
    setSwiperKey((prevKey) => prevKey + 1);
    setLoading(false);
  };

  const applyFilters = (profile) => {};

  const navigateToPreferenceSelection = () => {
    router.push({
      pathname: '/home/preferenceSelection',
      params: {
        data: JSON.stringify(connectedProfileData),
        handleFiltersApplied: handleFiltersApplied, // Serialize the object to a string
      },
    });
  };

  return (
    <>
      <HomeHeader
        onFiltersApplied={handleFiltersApplied}
        onNavigateToPreference={navigateToPreferenceSelection}
      />
      <View style={styles.container}>
        {filteredProfiles.length > 0 ? (
          <Swiper
            key={swiperKey} // Use the swiperKey here
            cards={filteredProfiles}
            renderCard={(profile) => (
              <TouchableOpacity onPress={() => handleCardPress(profile)}>
                <ProfileCard profile={profile} />
              </TouchableOpacity>
            )}
            onSwipedAll={() => console.log('No more profiles')}
            cardIndex={0}
            backgroundColor={'#f5f5f5'}
            stackSize={3}
            cardHorizontalMargin={width / 10}
            cardVerticalMargin={width / 5}
            containerStyle={styles.swiperContainer}
          />
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No profiles available
          </Text>
        )}
        {selectedProfile && (
          <ProfileModal
            isModalVisible={isModalVisible}
            onClose={closeModal}
            profile={selectedProfile}
          />
        )}
      </View>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 20,
  },
  swiperContainer: {
    backgroundColor: '#e6e8e4',
    flexGrow: 0, // Prevent the Swiper from growing to take up all available space
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 10,
  },
});

export default Home;
