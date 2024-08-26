import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { icons } from '../../constants';

const TabIcon = ({ icon, color, name, focused }) => {
  const isInfoTab = name === 'Info';

  return (
    <View style={styles.tabIconContainer}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor="gray"
        style={{
          width: isInfoTab ? 27 : 25, // Adjust size for Info tab
          height: isInfoTab ? 27 : 25, // Adjust size for Info tab
        }}
      />
      <Text
        style={{
          fontFamily: focused ? 'Poppins-Black' : 'Poppins-Regular',
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFA001',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
          backgroundColor: '#e6e8e4',
          borderTopColor: '#232533',
          height: 84,
        },
      }}
    >
      <Tabs.Screen
        name="info"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.move_home}
              name="Info"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              name="Home"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              name="Profile"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '3',
  },
  text: {
    fontFamily: 'Poppins-Regular',
  },
  textFocuesd: {
    fontFamily: 'Poppins-Black',
  },
});
