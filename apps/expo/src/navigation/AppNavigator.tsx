// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '../screens/home';
import ExploreScreen from '../screens/explore';
import ProfileScreen from '../screens/profile';

import { Ionicons } from '@expo/vector-icons';

type IoniconsProps = React.ComponentProps<typeof Ionicons>;

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const NAV_ICONS: { [key: string]: IoniconsProps['name'] } = {
    "Home": "home-outline",
    "Profile": "person-circle-outline",
    "Explore": "compass-outline"
}

function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="New Tags" component={HomeScreen} />
            <Stack.Screen name="Explore" component={ExploreScreen} />
        </Stack.Navigator>
    );
}

function ProfileStack() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
    );
}

function ExploreStack() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Explore" component={ExploreScreen} />
            <Stack.Screen name="New Tags" component={HomeScreen} />
        </Stack.Navigator>
    );
}

function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => (<Ionicons name={NAV_ICONS[route.name]} size={size} color={color} />),
                })}
            >
                <Tab.Screen name="Home" component={HomeStack} />
                <Tab.Screen name="Explore" component={ExploreStack} />
                <Tab.Screen name="Profile" component={ProfileStack} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;
