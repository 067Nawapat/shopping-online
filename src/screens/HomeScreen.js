import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../api/apiService';
import styles from '../styles/HomeScreen.styles';

const CATEGORIES = ['สำหรับคุณ', 'Streetwear', 'Sports', 'Luxe', 'ของสะสม'];

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

// ── Placeholder banner ─────────────────────────────────────
// รูปจากแหล่งที่น่าเชื่อถือ (ไม่ใช้ via.placeholder.com ที่ deprecated)
const BANNER_URI = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80';

const HomeScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [promoProducts, setPromoProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await apiService.getUser();
      if (userData) setUser(userData);
    } catch {
      // ละเว้นถ้าดึงไม่สำเร็จ (ยังไม่ล็อกอิน)
    }
  };

  const fetchData = async () => {
    try {
      const data = await apiService.getPromoProducts();
      setPromoProducts(data);
    } catch {
      // ถ้า API ล้มเหลว แสดง empty state แทน crash
      setPromoProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    await fetchUser();
    setRefreshing(false);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SA';

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
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

      {/* ── Category Tabs ── */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tabItem, activeCategory === index && styles.activeTab]}
              onPress={() => setActiveCategory(index)}
            >
              <Text style={[styles.tabText, activeCategory === index && styles.activeTabText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D0D0D" />}
      >
        {/* Banner App Store Style */}
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
            <TouchableOpacity style={styles.bannerBtn}>
              <Ionicons name="cart-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions (Minimal Scrollable 2-Rows) */}
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

        {/* Promo Products */}
        <View style={styles.promoSection}>
          <View style={styles.promoHeader}>
            <Text style={styles.promoTitle}>มีนา มีการ์ดยัง? ลด 1,200</Text>
            <TouchableOpacity style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>ดูเพิ่มเติม</Text>
              <Ionicons name="chevron-forward" size={14} color="#AAA" />
            </TouchableOpacity>
          </View>
          <Text style={styles.promoSubTitle}>
            ช้อป Trading Cards บนแอป SASOM ลดสูงสุด 1,200 | 4-8 มี.ค.
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#0D0D0D" style={{ marginVertical: 30 }} />
          ) : promoProducts.length === 0 ? (
            <Text style={{ color: '#AAA', textAlign: 'center', paddingVertical: 20, fontSize: 14 }}>
              ไม่พบสินค้าโปรโมชั่น
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
              {promoProducts.map((item) => (
                <TouchableOpacity key={item.id} style={styles.productCard} activeOpacity={0.8}>
                  <Text style={styles.productRank}>{item.rank}</Text>
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
