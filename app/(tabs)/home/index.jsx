import React, { useState, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import axios from 'axios';
import ProfileCard from '../../../components/ProfileCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileModal from '../../../components/ProfileModal';
import { useRouter } from 'expo-router';
import HomeHeader from '../../../components/HomeHeader';
import { API_BASE_URL } from '../../../constants';

const { width } = Dimensions.get('screen');

const Home = () => {
  const [profiles, setProfiles] = useState([]);
  const [connectedProfileData, setConnectedProfileData] = useState(null);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState(null);
  const [swiperKey, setSwiperKey] = useState(0);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchUserId(), fetchProfiles(), fetchFilters()]);
      } catch (error) {
        console.error('Error initializing data:', error);
        setError('Failed to load profiles. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const fetchUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    if (!id) {
      throw new Error('User ID not found');
    }
    setLoggedUserId(id);
  };

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profiles`);
      if (!response.data) {
        throw new Error('No profiles data received');
      }
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Failed to fetch profiles');
    }
  };

  const fetchFilters = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!userId || !token) {
        throw new Error('Authentication error');
      }

      const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          'x-auth-token': token,
        },
      });

      if (userResponse.data) {
        setConnectedProfileData(userResponse.data);
      }

      if (userResponse.data.filters) {
        const filterResponse = await axios.get(
          `${API_BASE_URL}/filters/${userResponse.data.filters}`,
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
        if (filterResponse.data) {
          setFilters(filterResponse.data);
        }
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
      throw new Error('Failed to fetch filters');
    }
  };

  useEffect(() => {
    const applyFilters = () => {
      if (!profiles || profiles.length === 0) {
        setFilteredProfiles([]);
        return;
      }

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
    try {
      setLoading(true);
      await Promise.all([fetchFilters(), fetchProfiles()]);
      setSwiperKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error('Error applying filters:', error);
      Alert.alert('Error', 'Failed to apply filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToPreferenceSelection = () => {
    router.push({
      pathname: '/home/preferenceSelection',
      params: {
        data: JSON.stringify(connectedProfileData),
        handleFiltersApplied: handleFiltersApplied,
      },
    });
  };

  const handleSwipeRight = async (cardIndex) => {
    if (cardIndex < 0 || cardIndex >= filteredProfiles.length) return;

    const likedUser = filteredProfiles[cardIndex];

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing');
      }

      const response = await axios.post(
        `${API_BASE_URL}/match/like`,
        { likedUserId: likedUser._id },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

      if (response.data.conversationId) {
        Alert.alert(
          "It's a Match!",
          'You have a new match! Start chatting now.'
        );
        router.push({
          pathname: '/chat',
          params: { conversationId: response.data.conversationId },
        });
      }
    } catch (error) {
      console.error('Error liking user:', error);
      Alert.alert('Error', 'Failed to like the user. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#21b78a" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <HomeHeader
        onFiltersApplied={handleFiltersApplied}
        onNavigateToPreference={navigateToPreferenceSelection}
      />
      <View style={styles.container}>
        {filteredProfiles.length > 0 ? (
          <Swiper
            key={swiperKey}
            cards={filteredProfiles}
            renderCard={(profile) => (
              <TouchableOpacity onPress={() => handleCardPress(profile)}>
                <ProfileCard profile={profile} />
              </TouchableOpacity>
            )}
            onSwipedAll={() => {
              Alert.alert(
                'No More Profiles',
                'Check back later for new matches!'
              );
            }}
            cardIndex={0}
            backgroundColor={'#f5f5f5'}
            stackSize={3}
            cardHorizontalMargin={width / 10}
            cardVerticalMargin={width / 5}
            containerStyle={styles.swiperContainer}
            animateCardOpacity
            disableBottomSwipe={true}
            disableTopSwipe={true}
            onSwipedRight={handleSwipeRight}
          />
        ) : (
          <View style={styles.noProfilesContainer}>
            <Text style={styles.noProfilesText}>
              No profiles available at the moment
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => {
                setLoading(true);
                fetchProfiles();
              }}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}
        {selectedProfile && (
          <ProfileModal
            isModalVisible={isModalVisible}
            onClose={closeModal}
            profile={selectedProfile}
          />
        )}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#21b78a" />
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
    flexGrow: 0,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#21b78a',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noProfilesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noProfilesText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#21b78a',
    padding: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
