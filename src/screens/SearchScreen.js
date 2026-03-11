import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  DeviceEventEmitter,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../api/apiService';
import styles from '../styles/SearchScreen.styles';

const BRANDS = [
  { id: '1', name: 'New Balance' },
  { id: '2', name: 'adidas' },
  { id: '3', name: 'Nike' },
  { id: '4', name: 'Puma' },
  { id: '5', name: 'Stussy' },
  { id: '6', name: 'Supreme' },
];

const TABS = ['ทั้งหมด', 'Streetwear', 'Luxury', 'ของสะสม', 'มือสอง'];

const SearchScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState(1); // "สำหรับคุณ" default
  const [wishlisted, setWishlisted] = useState({});

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('searchQuery', (text) => {
      setQuery(text || '');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiService.getProducts();
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, []);

  const toggleWishlist = useCallback((id) => {
    setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // กรองสินค้าตาม query
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q),
    );
  }, [products, query]);

  const FILTERS = [
    { id: 0, label: 'พร้อมส่ง', icon: 'flash', iconColor: '#22C55E' },
    { id: 1, label: 'สำหรับคุณ', icon: 'sparkles', iconColor: '#fff' },
    { id: 2, label: 'ราคาต่ำ-สูง', icon: 'arrow-up', iconColor: '#333' },
  ];

  const renderProduct = useCallback(
    ({ item }) => (
      <TouchableOpacity style={styles.productCard} activeOpacity={0.85}>
        <View style={styles.productImageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <View style={styles.soldBadge}>
            <Ionicons name="trending-up" size={10} color="#22C55E" />
            <Text style={styles.soldText}>{item.sold || 'sold'}</Text>
          </View>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productBrand}>{item.brand}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>ราคาเริ่มต้น</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>{item.price}</Text>
              <Ionicons name="flash" size={11} color="#22C55E" />
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => toggleWishlist(item.id)}
        >
          <Ionicons
            name={wishlisted[item.id] ? 'heart' : 'heart-outline'}
            size={18}
            color={wishlisted[item.id] ? '#EF4444' : '#999'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [wishlisted, toggleWishlist],
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Category Tabs ── */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
          {TABS.map((tab, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.tabItem, activeTab === idx && styles.activeTab]}
              onPress={() => setActiveTab(idx)}
            >
              <Text style={[styles.tabText, activeTab === idx && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Brand Strip (Transparent clean style) ── */}
      <View style={styles.brandContainer}>
        <Text style={styles.sectionTitle}>แบรนด์ยอดนิยม</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {BRANDS.map((brand) => (
            <TouchableOpacity key={brand.id} style={styles.brandItem}>
              <View style={styles.brandIconPlaceholder}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#0D0D0D' }}>
                  {brand.name.substring(0, 1)}
                </Text>
              </View>
              <Text style={styles.brandName} numberOfLines={1}>{brand.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Filter Bar ── */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterBadge, activeFilter === f.id && styles.activeFilter]}
              onPress={() => setActiveFilter(f.id)}
            >
              <Ionicons
                name={f.icon}
                size={13}
                color={activeFilter === f.id ? '#fff' : f.iconColor}
              />
              <Text
                style={[styles.filterText, activeFilter === f.id && styles.activeFilterText]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.filterIconBtn}>
          <Ionicons name="options-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* ── Product Grid ── */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0D0D0D"
          style={{ marginTop: 40 }}
        />
      ) : filteredProducts.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="search-outline" size={48} color="#DDD" />
          <Text style={{ color: '#AAA', marginTop: 12, fontSize: 14 }}>
            ไม่พบสินค้า "{query}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={[styles.productList, { paddingBottom: 110 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0D0D0D"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
