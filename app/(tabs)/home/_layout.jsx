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
            header: () => null,
          }}
        />
        <Stack.Screen
          name="preferenceSelection"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="filter" options={{ headerShown: false }} />
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
