import React from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, SafeAreaView, StatusBar, StyleSheet, Platform, TouchableOpacity, UIManager, LayoutAnimation, DeviceEventEmitter, TextInput, Keyboard, Animated, Easing } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { BlurView } from 'expo-blur';

// ── Screens ──────────────────────────────────────────────────
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import AuthScreen from './src/screens/AuthScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserInfoScreen from './src/screens/UserInfoScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ── Design Tokens ─────────────────────────────────────────────
const BLACK = '#0D0D0D';
const MUTED = '#AAAAAA';
const SEARCH_SURFACE = 'rgba(255, 255, 255, 0.75)';
const SEARCH_BORDER = 'rgba(255, 255, 255, 0.9)';
const SEARCH_TEXT = '#0D0D0D';
const SEARCH_PLACEHOLDER = '#8E8E93';
const SEARCH_ICON = '#111827';
const SEARCH_SECONDARY_ICON = '#6B7280';
const TAB_BAR_BOTTOM = Platform.OS === 'ios' ? 24 : 16;

const ScreenTransitionView = ({ children }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(18)).current;
  const scale = React.useRef(new Animated.Value(0.985)).current;

  useFocusEffect(
    React.useCallback(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      return () => {
        opacity.setValue(0);
        translateY.setValue(18);
        scale.setValue(0.985);
      };
    }, [opacity, scale, translateY]),
  );

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity,
        transform: [{ translateY }, { scale }],
      }}
    >
      {children}
    </Animated.View>
  );
};

const withScreenTransition = (Component) => {
  const WrappedScreen = (props) => (
    <ScreenTransitionView>
      <Component {...props} />
    </ScreenTransitionView>
  );

  WrappedScreen.displayName = `WithScreenTransition(${Component.displayName || Component.name || 'Screen'})`;
  return WrappedScreen;
};

// ── Placeholder Screens ───────────────────────────────────────
const CartScreen = () => (
  <SafeAreaView style={placeholderStyles.container}>
    <View style={placeholderStyles.content}>
      <Ionicons name="cart-outline" size={64} color="#DDD" />
      <Text style={placeholderStyles.title}>ตะกร้าสินค้า</Text>
      <Text style={placeholderStyles.sub}>รถเข็นของคุณยังว่างเปล่า</Text>
    </View>
  </SafeAreaView>
);

const NotificationsScreen = () => (
  <SafeAreaView style={placeholderStyles.container}>
    <View style={placeholderStyles.content}>
      <Ionicons name="notifications-outline" size={64} color="#DDD" />
      <Text style={placeholderStyles.title}>การแจ้งเตือน</Text>
      <Text style={placeholderStyles.sub}>ยังไม่มีการแจ้งเตือนใหม่</Text>
    </View>
  </SafeAreaView>
);

const placeholderStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: '700', color: BLACK, marginTop: 16 },
  sub: { fontSize: 14, color: MUTED, marginTop: 6 },
});

const HomeScreenAnimated = withScreenTransition(HomeScreen);
const SearchScreenAnimated = withScreenTransition(SearchScreen);
const AuthScreenAnimated = withScreenTransition(AuthScreen);
const LoginScreenAnimated = withScreenTransition(LoginScreen);
const RegisterScreenAnimated = withScreenTransition(RegisterScreen);
const ProfileScreenAnimated = withScreenTransition(ProfileScreen);
const UserInfoScreenAnimated = withScreenTransition(UserInfoScreen);
const CartScreenAnimated = withScreenTransition(CartScreen);
const NotificationsScreenAnimated = withScreenTransition(NotificationsScreen);

// ── Profile Stack ─────────────────────────────────────────────
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
    {/* Placeholder screens – จะสร้างจริงในเวอร์ชันถัดไป */}
    <Stack.Screen
      name="Coupons"
      component={() => (
        <SafeAreaView style={placeholderStyles.container}>
          <View style={placeholderStyles.content}>
            <Ionicons name="ticket-outline" size={64} color="#DDD" />
            <Text style={placeholderStyles.title}>โค้ดส่วนลด</Text>
            <Text style={placeholderStyles.sub}>กำลังพัฒนา...</Text>
          </View>
        </SafeAreaView>
      )}
    />
    <Stack.Screen
      name="AddressList"
      component={() => (
        <SafeAreaView style={placeholderStyles.container}>
          <View style={placeholderStyles.content}>
            <Ionicons name="location-outline" size={64} color="#DDD" />
            <Text style={placeholderStyles.title}>ที่อยู่จัดส่ง</Text>
            <Text style={placeholderStyles.sub}>กำลังพัฒนา...</Text>
          </View>
        </SafeAreaView>
      )}
    />
  </Stack.Navigator>
);

// ── Tab Icon Map ──────────────────────────────────────────────
const TAB_ICONS = {
  หน้าหลัก: { active: 'home', inactive: 'home-outline' },
  ตะกร้า: { active: 'cart', inactive: 'cart-outline' },
  แจ้งเตือน: { active: 'notifications', inactive: 'notifications-outline' },
  โปรไฟล์: { active: 'person', inactive: 'person-outline' },
  ค้นหา: { active: 'search', inactive: 'search-outline' },
};

// ── Custom Tab Bar ────────────────────────────────────────────
const CustomTabBar = ({ state, descriptors, navigation }) => {
  // แยกหน้า "ค้นหา" ออกมาจากหน้าอื่นๆ
  const leftRoutes = state.routes.filter((r) => r.name !== 'ค้นหา');
  const searchRoute = state.routes.find((r) => r.name === 'ค้นหา');
  const isSearchFocused = state.routes[state.index].name === 'ค้นหา';

  const [isSearchInputActive, setIsSearchInputActive] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const searchInputRef = React.useRef(null);
  const keyboardOffsetAnim = React.useRef(new Animated.Value(0)).current;
  const searchInputModeAnim = React.useRef(new Animated.Value(0)).current;
  const activeTabTranslateX = React.useRef(new Animated.Value(0)).current;
  const activeTabWidth = React.useRef(new Animated.Value(64)).current;
  const [tabLayouts, setTabLayouts] = React.useState({});

  React.useEffect(() => {
    if (!isSearchFocused && isSearchInputActive) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsSearchInputActive(false);
    }
  }, [isSearchFocused, isSearchInputActive]);

  React.useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      const keyboardHeight = event.endCoordinates?.height || 0;
      Animated.timing(keyboardOffsetAnim, {
        toValue: Math.max(0, keyboardHeight + 12),
        duration: Platform.OS === 'ios' ? 240 : 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      Animated.timing(keyboardOffsetAnim, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? 220 : 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardOffsetAnim]);

  React.useEffect(() => {
    Animated.timing(searchInputModeAnim, {
      toValue: isSearchInputActive ? 1 : 0,
      duration: isSearchInputActive ? 260 : 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isSearchInputActive, searchInputModeAnim]);

  React.useEffect(() => {
    if (isSearchFocused) {
      return;
    }

    const activeRoute = leftRoutes.find((route) => route.name === state.routes[state.index].name);
    if (!activeRoute) {
      return;
    }

    const activeLayout = tabLayouts[activeRoute.key];
    if (!activeLayout) {
      return;
    }

    Animated.timing(activeTabTranslateX, {
      toValue: activeLayout.x,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    Animated.timing(activeTabWidth, {
      toValue: activeLayout.width,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [activeTabTranslateX, activeTabWidth, isSearchFocused, leftRoutes, state.index, state.routes, tabLayouts]);

  const activateSearchInput = () => {
    if (!isSearchInputActive) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsSearchInputActive(true);
    }
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const collapseSearchInput = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearchText('');
    setIsSearchInputActive(false);
    searchInputRef.current?.blur();
    DeviceEventEmitter.emit('searchQuery', '');
  };

  const onLeftCirclePress = () => {
    navigation.navigate('หน้าหลัก');
  };

  const idleSearchOpacity = searchInputModeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const idleSearchTranslate = searchInputModeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  const activeSearchOpacity = searchInputModeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const activeSearchTranslate = searchInputModeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });
  const activeSearchScale = searchInputModeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1],
  });

  return (
    <Animated.View
      style={[
        tabStyles.tabBarContainer,
        {
          transform: [{ translateY: Animated.multiply(keyboardOffsetAnim, -1) }],
        },
      ]}
    >

      {/* ── Left Container (Normal Menu OR Layers Button) ── */}
      {!isSearchFocused && (
        <View
        style={[
          tabStyles.leftContainerBase,
          tabStyles.leftContainerDefault,
        ]}
      >
        <BlurView intensity={80} tint="light" style={tabStyles.blurView} />
          <View style={tabStyles.leftPillContent}>
            <Animated.View
              pointerEvents="none"
              style={[
                tabStyles.tabItemActiveIndicator,
                {
                  width: activeTabWidth,
                  transform: [{ translateX: activeTabTranslateX }],
                },
              ]}
            />
            {leftRoutes.map((route) => {
              const isFocused = state.routes[state.index].name === route.name;
              const onPress = () => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
              };

              const icons = TAB_ICONS[route.name];
              const iconName = isFocused ? icons?.active : icons?.inactive;
              const color = isFocused ? BLACK : MUTED;

              return (
                <TouchableOpacity
                  key={route.key}
                  activeOpacity={0.8}
                  onPress={onPress}
                  style={tabStyles.tabItem}
                  onLayout={(event) => {
                    const { x, width } = event.nativeEvent.layout;
                    setTabLayouts((prev) => {
                      const current = prev[route.key];
                      if (current && current.x === x && current.width === width) {
                        return prev;
                      }
                      return { ...prev, [route.key]: { x, width } };
                    });
                  }}
                >
                  <Ionicons name={iconName} size={22} color={color} />
                  <Text style={[tabStyles.tabText, { color: color, fontWeight: isFocused ? '800' : '600' }]}>
                    {route.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* ── Right Container (Search Button OR Search Input Box) ── */}
      {!isSearchFocused && searchRoute && (
        <View
          style={[
            tabStyles.rightContainerBase,
            tabStyles.rightContainerDefault,
          ]}
        >
          <BlurView intensity={80} tint="light" style={tabStyles.blurViewCircle} />
          <TouchableOpacity style={tabStyles.centerContent} activeOpacity={0.8} onPress={() => navigation.navigate('ค้นหา')}>
            <Ionicons
              name={TAB_ICONS['ค้นหา'].inactive}
              size={24}
              color={BLACK}
            />
          </TouchableOpacity>
        </View>
      )}
      {isSearchFocused && (
        <View style={tabStyles.searchStateContainer}>
          <Animated.View
            pointerEvents={isSearchInputActive ? 'none' : 'auto'}
            style={[
              tabStyles.searchIdleRow,
              {
                opacity: idleSearchOpacity,
                transform: [{ translateY: idleSearchTranslate }],
              },
            ]}
          >
            <View style={[tabStyles.leftContainerBase, tabStyles.leftContainerSearchIdle, { width: 48 }]}>
              <BlurView intensity={80} tint="light" style={tabStyles.blurView} />
              <TouchableOpacity
                style={tabStyles.centerContent}
                onPress={onLeftCirclePress}
                activeOpacity={0.8}
              >
                <Ionicons name="layers" size={24} color="#0D0D0D" />
              </TouchableOpacity>
            </View>

            <View style={[tabStyles.rightContainerBase, tabStyles.rightContainerSearchIdle]}>
              <BlurView intensity={80} tint="light" style={tabStyles.blurViewCircle} />
              <TouchableOpacity
                activeOpacity={1}
                style={tabStyles.searchBarContent}
                onPress={activateSearchInput}
              >
                <Ionicons name="search" size={20} color={SEARCH_ICON} />
                <Text
                  style={[
                    tabStyles.expandedSearchInput,
                    !searchText && tabStyles.searchPlaceholderText,
                  ]}
                  numberOfLines={1}
                >
                  {searchText || 'เกม แอป เรื่องราว และอื่นๆ'}
                </Text>
                <Ionicons name="mic-outline" size={18} color={SEARCH_SECONDARY_ICON} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View
            pointerEvents={isSearchInputActive ? 'auto' : 'none'}
            style={[
              tabStyles.searchActiveOverlay,
              {
                opacity: activeSearchOpacity,
                transform: [{ translateY: activeSearchTranslate }, { scale: activeSearchScale }],
              },
            ]}
          >
            <View style={tabStyles.searchActiveRow}>
              <View style={tabStyles.searchActivePill}>
                <Ionicons name="search" size={20} color={SEARCH_ICON} />
                <TextInput
                  ref={searchInputRef}
                  style={tabStyles.searchActiveInput}
                  placeholder="เกม แอป เรื่องราว และอื่นๆ"
                  placeholderTextColor={SEARCH_PLACEHOLDER}
                  value={searchText}
                  onChangeText={(text) => {
                    setSearchText(text);
                    DeviceEventEmitter.emit('searchQuery', text);
                  }}
                />
                <Ionicons name="mic-outline" size={18} color={SEARCH_SECONDARY_ICON} />
              </View>
              <TouchableOpacity style={tabStyles.searchActiveCloseButton} onPress={collapseSearchInput} activeOpacity={0.8}>
                <Ionicons name="close" size={24} color={SEARCH_ICON} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </Animated.View>
  );
};

const tabStyles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: TAB_BAR_BOTTOM,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchStateContainer: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
  },
  searchIdleRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchActiveOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  leftContainerBase: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  leftContainerDefault: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    marginRight: 8,
  },
  leftContainerSearchIdle: {
    height: 48,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
    borderColor: SEARCH_BORDER,
  },
  rightContainerBase: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: SEARCH_BORDER,
  },
  rightContainerDefault: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  rightContainerSearchIdle: {
    flex: 1,
    height: 60,
    borderRadius: 30,
  },
  rightContainerSearchActive: {
    flex: 1,
    borderRadius: 30,
    height: 60,
  },
  searchActiveRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchActivePill: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    backgroundColor: SEARCH_SURFACE,
    borderWidth: 1,
    borderColor: SEARCH_BORDER,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  searchActiveInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: SEARCH_TEXT,
    fontWeight: '500',
  },
  searchActiveCloseButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 10,
    backgroundColor: SEARCH_SURFACE,
    borderWidth: 1,
    borderColor: SEARCH_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  blurViewCircle: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: SEARCH_SURFACE,
    borderWidth: 1.5,
    borderColor: SEARCH_BORDER,
  },
  leftPillContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 6,
    position: 'relative',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  expandedSearchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: SEARCH_TEXT,
    fontWeight: '500',
  },
  searchPlaceholderText: {
    color: SEARCH_PLACEHOLDER,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    height: 48,
    minWidth: 64,
    borderRadius: 24,
  },
  tabItemActiveIndicator: {
    position: 'absolute',
    left: 0,
    top: 6,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#CCFF00',
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 10,
    marginTop: 2,
  },
});

// ── App Root ──────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
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
      </NavigationContainer>
    </>
  );
}
