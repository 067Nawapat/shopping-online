import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../api/apiService';
import ConfirmModal from '../components/ConfirmModal';
import styles from '../styles/HomeScreen.styles';

const QUICK_ACTIONS = [
  { id: '1', title: 'Ship Now', icon: 'airplane-outline' },
  { id: '2', title: 'Pre-Loved', icon: 'heart-circle-outline' },
  { id: '3', title: 'ราคาดี', icon: 'pricetag-outline' },
  { id: '4', title: 'New Drop', icon: 'sparkles-outline' },
  { id: '5', title: 'Hot Deals', icon: 'flame-outline' },
  { id: '6', title: 'Affiliates', icon: 'people-outline' },
  { id: '7', title: 'Gongkan', icon: 'color-palette-outline' },
  { id: '8', title: 'Amp. Up', icon: 'flash-outline' },
  { id: '9', title: 'MASS', icon: 'grid-outline' },
  { id: '10', title: 'Mega Evo', icon: 'rocket-outline' },
];

const BANNER_URI = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80';

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([{ id: 0, name: 'สำหรับคุณ' }]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [promoProducts, setPromoProducts] = useState([]);
  const [feedProducts, setFeedProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [infoModal, setInfoModal] = useState(null);

  useEffect(() => {
    initialLoad();
  }, []);

  const initialLoad = async () => {
    setLoading(true);
    const userData = await fetchUser();
    await Promise.all([
      fetchCategories(),
      fetchProducts(0),
      fetchFeedProducts(),
      userData ? fetchWishlist(userData.id) : Promise.resolve(),
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
      if (data && Array.isArray(data)) {
        setCategories([{ id: 0, name: 'สำหรับคุณ' }, ...data]);
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  };

  const fetchProducts = async (catId) => {
    try {
      let data;
      if (catId === 0) {
        data = await apiService.getPromoProducts();
      } else {
        data = await apiService.getProducts(catId);
      }
      setPromoProducts(data || []);
    } catch (error) {
      console.error('Fetch products error:', error);
      setPromoProducts([]);
    }
  };

  const fetchFeedProducts = async () => {
    try {
      const data = await apiService.getProducts();
      setFeedProducts(data || []);
    } catch (error) {
      console.error('Fetch feed products error:', error);
    }
  };

  const fetchWishlist = async (userId) => {
    try {
      const data = await apiService.getWishlist(userId);
      if (Array.isArray(data)) {
        setWishlistIds(data.map(item => item.id));
      }
    } catch (error) {
      console.error('Fetch wishlist error:', error);
    }
  };

  const handleCategoryPress = (index, catId) => {
    setActiveCategory(index);
    fetchProducts(catId);
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      setInfoModal({ title: 'แจ้งเตือน', message: 'กรุณาเข้าสู่ระบบเพื่อใช้งานสิ่งที่อยากได้' });
      return;
    }

    try {
      const result = await apiService.toggleWishlist(user.id, productId);
      if (result.status === 'added' || result.status === 'success') {
        setWishlistIds(prev => [...prev, productId]);
      } else if (result.status === 'removed') {
        setWishlistIds(prev => prev.filter(id => id !== productId));
      }
    } catch (error) {
      console.error('Toggle wishlist error:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const userData = await fetchUser();
    await Promise.all([
      fetchCategories(),
      fetchProducts(categories[activeCategory]?.id || 0),
      fetchFeedProducts(),
      userData ? fetchWishlist(userData.id) : Promise.resolve(),
    ]);
    setRefreshing(false);
  }, [activeCategory, categories]);

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SA';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>หน้าหลัก</Text>
        <TouchableOpacity
          style={styles.avatarBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('โปรไฟล์')}
        >
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
          ) : (
            <Text style={{ fontSize: 14, fontWeight: '900', color: '#0D0D0D' }}>{initials}</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.tabItem, activeCategory === index && styles.activeTab]}
              onPress={() => handleCategoryPress(index, cat.id)}
            >
              <Text style={[styles.tabText, activeCategory === index && styles.activeTabText]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D0D0D" />}
      >
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: BANNER_URI }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlayTop}>
            <Text style={styles.bannerCategory}>ดีลพิเศษวันนี้</Text>
            <Text style={styles.bannerTitle}>ตะลุยฝ่าหายนะใน 10 นาทีแรก</Text>
            <Text style={styles.bannerSub}>ออกผจญภัยในโลกของสตรีทแฟชั่น</Text>
          </View>
          <View style={styles.bannerOverlayBottom}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/714/714152.png' }}
              style={styles.bannerIcon}
            />
            <View style={styles.bannerAppInfo}>
              <Text style={styles.bannerAppName}>SASOM: ซื้อขายสตรีทแวร์</Text>
              <Text style={styles.bannerAppSub}>ในตะกร้าลด 1,200</Text>
            </View>
            <TouchableOpacity style={styles.bannerBtn} onPress={() => navigation.navigate('ตะกร้า')}>
              <Ionicons name="cart-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContainer}
        >
          <View>
            <View style={styles.actionRow}>
              {QUICK_ACTIONS.slice(0, 5).map((item) => (
                <TouchableOpacity key={item.id} style={styles.actionItem} activeOpacity={0.7}>
                  <View style={styles.actionIconBg}>
                    <Ionicons name={item.icon} size={24} color="#4A4A4A" />
                  </View>
                  <Text style={styles.actionText} numberOfLines={1}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.actionRow}>
              {QUICK_ACTIONS.slice(5, 10).map((item) => (
                <TouchableOpacity key={item.id} style={styles.actionItem} activeOpacity={0.7}>
                  <View style={styles.actionIconBg}>
                    <Ionicons name={item.icon} size={24} color="#4A4A4A" />
                  </View>
                  <Text style={styles.actionText} numberOfLines={1}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.sectionSpacer} />

        {/* Promo Section */}
        <View style={styles.promoSection}>
          <View style={styles.promoHeader}>
            <Text style={styles.promoTitle}>
              {activeCategory === 0 ? 'มีนา มีการ์ดยัง? ลด 1,200' : categories[activeCategory].name}
            </Text>
            <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('ค้นหา')}>
              <Text style={styles.viewAllText}>ดูเพิ่มเติม</Text>
              <Ionicons name="chevron-forward" size={14} color="#AAA" />
            </TouchableOpacity>
          </View>
          <Text style={styles.promoSubTitle}>
            {activeCategory === 0 ? 'ช้อป Trading Cards บนแอป SASOM ลดสูงสุด 1,200 | 4-8 มี.ค.' : `เลือกชมสินค้าในหมวด ${categories[activeCategory].name}`}
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#0D0D0D" style={{ marginVertical: 30 }} />
          ) : promoProducts.length === 0 ? (
            <Text style={{ color: '#AAA', textAlign: 'center', paddingVertical: 20, fontSize: 14 }}>
              ไม่พบสินค้าในหมวดนี้
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
              {promoProducts.map((item, index) => (
                <TouchableOpacity 
                  key={item.id || index} 
                  style={styles.productCard} 
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                >
                  <Text style={styles.productRank}>{item.rank || index + 1}</Text>
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.sectionSpacer} />

        {/* Feed Grid Section */}
        <View style={styles.feedSection}>
          <Text style={styles.feedTitle}>สินค้าแนะนำ</Text>
          <View style={styles.feedGrid}>
            {feedProducts.map((item) => {
              const isWishlisted = wishlistIds.includes(item.id);
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
                      <Ionicons name="trending-up" size={10} color="#22C55E" />
                      <Text style={styles.feedSoldText}>{item.sold || '0'} sold</Text>
                    </View>
                  </View>
                  <View style={styles.feedContent}>
                    <Text style={styles.feedBrand}>{item.brand}</Text>
                    <Text style={styles.feedName} numberOfLines={2}>{item.name}</Text>
                    <View style={styles.feedPriceContainer}>
                      <Text style={styles.feedPriceLabel}>ราคาเริ่มต้น</Text>
                      <View style={styles.feedPriceRow}>
                        <Text style={styles.feedPrice}>฿{parseFloat(item.price).toLocaleString()}</Text>
                        <Ionicons name="flash" size={12} color="#22C55E" style={{ marginLeft: 4 }} />
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.feedHeartBtn} 
                    onPress={() => toggleWishlist(item.id)}
                  >
                    <Ionicons 
                      name={isWishlisted ? "heart" : "heart-outline"} 
                      size={18} 
                      color={isWishlisted ? "#EF4444" : "#AAA"} 
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 110 }} />
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
