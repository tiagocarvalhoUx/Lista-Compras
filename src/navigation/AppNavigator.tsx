import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyListScreen from '../screens/MyListScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ShareScreen from '../screens/ShareScreen';
import { useTheme } from '../hooks/useTheme';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

const linking = {
  prefixes: ['/'],
  config: {
    screens: {
      MyList: 'lista',
      History: 'historico',
      Share: 'compartilhar',
    },
  },
};

function TabIcon({ emoji, label, focused, color }: { emoji: string; label: string; focused: boolean; color: string }) {
  const { fonts } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: focused ? 26 : 22 }}>{emoji}</Text>
      <Text style={{ fontSize: fonts.small - 2, color, fontWeight: focused ? '700' : '500', marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}

export default function AppNavigator() {
  const { colors } = useTheme();

  return (
    <NavigationContainer linking={linking}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: 1,
            height: 72,
            paddingBottom: 8,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="MyList"
          component={MyListScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="🛒" label="Lista" focused={focused} color={color} />
            ),
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: '#94A3B8',
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="🕒" label="Histórico" focused={focused} color={color} />
            ),
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: '#94A3B8',
          }}
        />
        <Tab.Screen
          name="Share"
          component={ShareScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon emoji="👥" label="Compartilhar" focused={focused} color={color} />
            ),
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: '#94A3B8',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
