import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { FontFamily, Palette, Radius } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Palette.primary,
        tabBarInactiveTintColor: Palette.mutedForeground,
        tabBarActiveBackgroundColor: Palette.primarySoft,
        tabBarLabelStyle: {
          fontFamily: FontFamily.bodyBold,
          fontSize: 13,
        },
        tabBarStyle: {
          backgroundColor: Palette.card,
          borderTopColor: Palette.border,
          borderTopWidth: 1,
          paddingTop: 8,
        },
        tabBarItemStyle: {
          borderRadius: Radius['2xl'],
          marginHorizontal: 6,
          marginVertical: 6,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hjem',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Spillbrett',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="checkerboard" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rules"
        options={{
          title: 'Hvordan spille',
          tabBarIcon: ({ color }) => (
            <Ionicons name="book-outline" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
