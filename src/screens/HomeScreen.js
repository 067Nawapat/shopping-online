import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../api/apiService';
import ConfirmModal from '../components/ConfirmModal';
import styles from '../styles/HomeScreen.styles';
import bannerStyles from '../styles/banner.styles';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [feedProducts, setFeedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [infoModal, setInfoModal] = useState(null);
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);

  const bannerListRef = useRef(null);
  const bannerIndexRef = useRef(0);

  useEffect(() => {
    initialLoad();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      bannerIndexRef.current = (bannerIndexRef.current + 1) % banners.length;
      bannerListRef.current?.scrollToIndex({
        index: bannerIndexRef.current,
        animated: true,
      });
      setActiveBanner(bannerIndexRef.current);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  const initialLoad = async () => {
    setLoading(true);
    const userData = await fetchUser();
    await Promise.all([
      fetchCategories(),
      fetchBanners(),
      fetchHomeProducts(),
    ]);
    setLoading(false);
  };

  const fetchUser = async () => {
    try {
      const userData = await apiService.getUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Fetch user error:', error);
      return null;
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiService.getCategories();
      const catList = Array.isArray(data) ? data : [];
      setCategories(catList);
      if (catList.length > 0) setActiveCategory(catList[0].id);
    } catch (error) {
      console.error('Fetch categories error:', error);
      setCategories([]);
    }
  };

  const fetchBanners = async () => {
    try {
      const data = await apiService.getBanners();
      setBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch banners error:', error);
      setBanners([]);
    }
  };

  const fetchHomeProducts = async () => {
    try {
      const data = await apiService.getProducts();
      const productList = Array.isArray(data) ? data : [];
      setFeedProducts(productList);
    } catch (error) {
      console.error('Fetch home products error:', error);
      setFeedProducts([]);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchUser(),
      fetchCategories(),
      fetchBanners(),
      fetchHomeProducts(),
    ]);
    setRefreshing(false);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SO';

  const shortcutCategories = useMemo(() => {
    const base = categories.slice(0, 8);
    return base;
  }, [categories]);

  const handleBannerScrollEnd = (event) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    bannerIndexRef.current = nextIndex;
    setActiveBanner(nextIndex);
  };

  const renderBanner = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={bannerStyles.bannerContainer}
      onPress={() => item.product_id && navigation.navigate('ProductDetail', { productId: item.product_id })}
    >
      <ImageBackground source={{ uri: item.image }} style={bannerStyles.imageBackground} resizeMode="cover">
        <View style={bannerStyles.overlay}>
          <View style={bannerStyles.textSection}>
            <Text style={bannerStyles.eyebrow}>ดีลพิเศษวันนี้</Text>
            <Text style={bannerStyles.title} numberOfLines={2}>{item.title}</Text>
            <Text style={bannerStyles.description} numberOfLines={1}>{item.subtitle}</Text>
          </View>

          <TouchableOpacity 
            style={bannerStyles.cartIcon}
            onPress={() => item.product_id && navigation.navigate('ProductDetail', { productId: item.product_id })}
          >
            <Ionicons name="cart-outline" size={26} color="white" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>หน้าหลัก</Text>
          <TouchableOpacity
            style={styles.avatarBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('โปรไฟล์')}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shortcutList}
          style={styles.shortcutScroll}
        >
          {shortcutCategories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.shortcutCard,
                activeCategory === item.id && styles.shortcutCardActive
              ]}
              activeOpacity={0.7}
              onPress={() => setActiveCategory(item.id)}
            >
              <Text style={[
                styles.shortcutTitle,
                activeCategory === item.id && styles.shortcutTitleActive
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D0D0D" />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0D0D0D" style={{ marginTop: 48 }} />
        ) : (
          <>
            <View style={styles.bannerSection}>
              <FlatList
                ref={bannerListRef}
                data={banners}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderBanner}
                horizontal
                pagingEnabled={false}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                snapToInterval={screenWidth}
                snapToAlignment="center"
                onMomentumScrollEnd={handleBannerScrollEnd}
                contentContainerStyle={{ paddingHorizontal: 0 }}
                getItemLayout={(_, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
              />

              {banners.length > 1 ? (
                <View style={styles.bannerDots}>
                  {banners.map((item, index) => (
                    <View
                      key={item.id}
                      style={[styles.bannerDot, index === activeBanner && styles.bannerDotActive]}
                    />
                  ))}
                </View>
              ) : null}
            </View>

            <View style={styles.feedSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>สินค้าแนะนำ</Text>
                <TouchableOpacity
                  style={styles.viewAllBtn}
                  onPress={() =>
                    navigation.navigate('CategoryProducts', {
                      categoryId: 0,
                      title: 'สินค้าทั้งหมด',
                    })
                  }
                >
                  <Text style={styles.viewAllText}>ดูทั้งหมด</Text>
                  <Ionicons name="chevron-forward" size={14} color="#9A9A9A" />
                </TouchableOpacity>
              </View>

              <View style={styles.feedGrid}>
                {feedProducts.map((item) => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.feedCard}
                      activeOpacity={0.9}
                      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                    >
                      <View style={styles.feedImageContainer}>
                        <Image source={{ uri: item.image }} style={styles.feedProductImage} />
                        <View style={styles.feedSoldBadge}>
                          <Text style={styles.feedSoldText}>{item.sold || '0'} sold</Text>
                        </View>
                      </View>
                      <View style={styles.feedContent}>
                        <Text style={styles.feedBrand}>{item.brand}</Text>
                        <Text style={styles.feedName} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <View style={styles.feedPriceContainer}>
                          <Text style={styles.feedPrice}>฿{parseFloat(item.price || 0).toLocaleString()}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={{ height: 110 }} />
          </>
        )}
      </ScrollView>

      <ConfirmModal
        visible={!!infoModal}
        title={infoModal?.title}
        message={infoModal?.message}
        confirmText="ตกลง"
        hideCancel
        onConfirm={() => setInfoModal(null)}
        onCancel={() => setInfoModal(null)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
