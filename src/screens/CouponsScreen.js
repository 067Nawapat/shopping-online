import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../api/apiService';
import { BLACK, MUTED } from '../utils/constants';
import { SPACING } from '../styles/theme';

const CouponsScreen = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await apiService.getCoupons();
      setCoupons(data || []);
    } catch (error) {
      console.error('Fetch coupons error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCoupons();
  };

  const renderCoupon = ({ item }) => (
    <View style={styles.couponCard}>
      <View style={styles.couponIcon}>
        <Ionicons name="ticket-outline" size={32} color={BLACK} />
      </View>
      <View style={styles.couponInfo}>
        <Text style={styles.couponCode}>{item.code}</Text>
        <Text style={styles.couponDiscount}>ลด ฿{parseFloat(item.discount).toLocaleString()}</Text>
        {item.expiry_date && (
          <Text style={styles.couponExpiry}>หมดอายุ: {item.expiry_date}</Text>
        )}
      </View>
      <View style={[styles.statusBadge, item.status === 'active' ? styles.activeBadge : styles.expiredBadge]}>
        <Text style={styles.statusText}>{item.status === 'active' ? 'ใช้ได้' : 'หมดอายุ'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>โค้ดส่วนลด</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={BLACK} style={{ marginTop: 40 }} />
      ) : coupons.length === 0 ? (
        <View style={styles.content}>
          <Ionicons name="ticket-outline" size={64} color="#DDD" />
          <Text style={styles.title}>ไม่มีโค้ดส่วนลด</Text>
          <Text style={styles.sub}>คุณยังไม่มีโค้ดส่วนลดในขณะนี้</Text>
        </View>
      ) : (
        <FlatList
          data={coupons}
          renderItem={renderCoupon}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLACK} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 20,
    paddingTop: SPACING.screenHeaderTop,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: BLACK },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: '700', color: BLACK, marginTop: 16 },
  sub: { fontSize: 14, color: MUTED, marginTop: 6 },
  list: { padding: 20 },
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEE',
    position: 'relative',
  },
  couponIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#CCFF00',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  couponInfo: { flex: 1 },
  couponCode: { fontSize: 18, fontWeight: '800', color: BLACK },
  couponDiscount: { fontSize: 15, fontWeight: '600', color: '#EF4444', marginTop: 2 },
  couponExpiry: { fontSize: 12, color: MUTED, marginTop: 4 },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeBadge: { backgroundColor: 'rgba(34, 197, 94, 0.1)' },
  expiredBadge: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  statusText: { fontSize: 10, fontWeight: '700', color: BLACK },
});

export default CouponsScreen;
