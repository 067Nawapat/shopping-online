import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import AuthScreen from '../screens/AuthScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import CartScreen from '../screens/CartScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import CouponsScreen from '../screens/CouponsScreen';
import AddressListScreen from '../screens/AddressListScreen';

import CustomTabBar from '../components/CustomTabBar';
import { withScreenTransition } from '../components/ScreenTransition';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeScreenAnimated = withScreenTransition(HomeScreen);
const SearchScreenAnimated = withScreenTransition(SearchScreen);
const AuthScreenAnimated = withScreenTransition(AuthScreen);
const LoginScreenAnimated = withScreenTransition(LoginScreen);
const RegisterScreenAnimated = withScreenTransition(RegisterScreen);
const ProfileScreenAnimated = withScreenTransition(ProfileScreen);
const UserInfoScreenAnimated = withScreenTransition(UserInfoScreen);
const CartScreenAnimated = withScreenTransition(CartScreen);
const NotificationsScreenAnimated = withScreenTransition(NotificationsScreen);
const CouponsScreenAnimated = withScreenTransition(CouponsScreen);
const AddressListScreenAnimated = withScreenTransition(AddressListScreen);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
      gestureEnabled: true,
      cardStyle: { backgroundColor: '#fff' },
    }}
  >
    <Stack.Screen name="ProfileHome" component={ProfileScreenAnimated} />
    <Stack.Screen name="Auth" component={AuthScreenAnimated} />
    <Stack.Screen name="Login" component={LoginScreenAnimated} />
    <Stack.Screen name="Register" component={RegisterScreenAnimated} />
    <Stack.Screen name="UserInfo" component={UserInfoScreenAnimated} />
    <Stack.Screen name="Coupons" component={CouponsScreenAnimated} />
    <Stack.Screen name="AddressList" component={AddressListScreenAnimated} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="หน้าหลัก" component={HomeScreenAnimated} />
      <Tab.Screen name="ตะกร้า" component={CartScreenAnimated} />
      <Tab.Screen name="แจ้งเตือน" component={NotificationsScreenAnimated} />
      <Tab.Screen name="โปรไฟล์" component={ProfileStack} />
      <Tab.Screen name="ค้นหา" component={SearchScreenAnimated} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
