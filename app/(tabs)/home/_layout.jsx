import React from 'react';
import { Stack } from 'expo-router';
import {
  StatusBar,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';

import HomeHeader from '../../../components/HomeHeader.jsx';

export default function HomeLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Find Your Next Roommate',
            headerStyle: {
              height: 10,
              backgroundColor: 'red',
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              borderBottomWidth: 0, // Remove bottom border
            },
            headerShadowVisible: false,
            headerTintColor: '#fff', // Text color in the header
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            header: () => <HomeHeader />,
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  filterText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
