/* eslint-disable react/no-unstable-nested-components */
import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Card',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'card' : 'card-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="applepay"
                options={{
                    title: 'Apple Pay',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'wallet' : 'wallet-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="tds/index"
                options={{
                    title: '3Dセキュア',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'shield' : 'shield-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="tds/finish"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
