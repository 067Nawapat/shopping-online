import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../api/apiService';
import { BLACK, MUTED } from '../utils/constants';
import { SPACING, SHADOW } from '../styles/theme';
import { extractOrders, normalizeOrderStatus } from '../utils/orderUtils';

const OrdersListScreen = ({ navigation, route }) => {
  const { type } = route.params || { type: 'to_ship' };
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getConfig = () => {
    switch (type) {
      case 'to_ship':
        return {
          title: 'รอการจัดส่ง',
          emptyTitle: 'ไม่มีรายการรอการจัดส่ง',
          emptySub: 'เมื่อคุณชำระเงินแล้ว รายการจะมาแสดงที่นี่',
          icon: 'cube-outline',
          statusLabel: 'รอการจัดส่ง',
          badgeColor: '#F59E0B',
          badgeBg: '#FFFBEB',
          filter: (o) => {
            const s = normalizeOrderStatus(o);
            return s === 'waiting' || s === 'verifying';
          }
        };
      case 'to_receive':
        return {
          title: 'ที่ต้องได้รับ',
          emptyTitle: 'ไม่มีรายการที่ต้องได้รับ',
          emptySub: 'คุณสามารถติดตามสถานะการจัดส่งได้ที่นี่',
          icon: 'car-outline',
          statusLabel: 'กำลังจัดส่ง',
          badgeColor: '#3B82F6',
          badgeBg: '#EFF6FF',
          filter: (o) => normalizeOrderStatus(o) === 'shipping'
        };
      case 'completed':
        return {
          title: 'ให้คะแนน',
          emptyTitle: 'ไม่มีรายการที่สำเร็จ',
          emptySub: 'รายการที่จัดส่งสำเร็จแล้วจะมาแสดงที่นี่เพื่อรับการให้คะแนน',
          icon: 'star-outline',
          statusLabel: 'สำเร็จแล้ว',
          badgeColor: '#10B981',
          badgeBg: '#ECFDF5',
          filter: (o) => normalizeOrderStatus(o) === 'completed'
        };
      default:
        return {
          title: 'คำสั่งซื้อ',
          emptyTitle: 'ไม่มีรายการ',
          emptySub: '',
          icon: 'receipt-outline',
          statusLabel: 'ปกติ',
          badgeColor: BLACK,
          badgeBg: '#F0F0F0',
          filter: () => true
        };
    }
  };

  const config = getConfig();

  useEffect(() => {
    fetchData();
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userData = await apiService.getUser();
      if (!userData) {
        setOrders([]);
        return;
      }

      const response = await apiService.getOrders(userData.id);
      const ordersArray = extractOrders(response);
      const filteredOrders = ordersArray.filter(config.filter);
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Fetch orders error:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const totalPrice = Number(item.total_price || 0);
    const orderDate = item.created_at
      ? new Date(item.created_at).toLocaleDateString('th-TH')
      : '-';
    const firstItem = item.items?.[0];
    const extraItemCount = Math.max((item.items?.length || 0) - 1, 0);
    const productName = firstItem?.name || 'ยังไม่มีข้อมูลสินค้า';
    const productMeta = firstItem?.brand
      ? firstItem.size && firstItem.size !== '-'
        ? `${firstItem.brand} • ไซซ์ ${firstItem.size}`
        : firstItem.brand
      : firstItem?.size && firstItem.size !== '-'
        ? `ไซซ์ ${firstItem.size}`
        : extraItemCount > 0
          ? `และสินค้าอื่นอีก ${extraItemCount} รายการ`
          : 'ไม่มีข้อมูลรายการ';

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderIdText}>หมายเลขคำสั่งซื้อ #{item.id}</Text>
          <Text style={[styles.statusBadge, { color: config.badgeColor, backgroundColor: config.badgeBg }]}>
            {config.statusLabel}
          </Text>
        </View>

        <View style={styles.orderBody}>
          {firstItem?.image ? (
            <Image source={{ uri: firstItem.image }} style={styles.productImage} />
          ) : (
            <View style={styles.placeholderImg}>
              <Ionicons name="cube-outline" size={30} color="#DDD" />
            </View>
          )}
          <View style={styles.orderMainInfo}>
            <Text style={styles.productName} numberOfLines={2}>{productName}</Text>
            <Text style={styles.productMeta} numberOfLines={1}>
              {extraItemCount > 0 && firstItem
                ? `${productMeta} • อีก ${extraItemCount} รายการ`
                : productMeta}
            </Text>
            <Text style={styles.dateText}>วันที่สั่งซื้อ: {orderDate}</Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>ยอดรวมสุทธิ</Text>
            <Text style={styles.totalValue}>฿{totalPrice.toLocaleString()}</Text>
          </View>
          
          {type === 'completed' && (
             <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>ให้คะแนนสินค้า</Text>
             </TouchableOpacity>
          )}

          {(type === 'to_ship' || type === 'to_receive') && (
             <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F0F0F0' }]}>
                <Text style={[styles.actionButtonText, { color: BLACK }]}>ดูรายละเอียด</Text>
             </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={BLACK} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name={config.icon} size={64} color="#DDD" />
          <Text style={styles.emptyTitle}>{config.emptyTitle}</Text>
          <Text style={styles.emptySub}>{config.emptySub}</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: SPACING.screenHeaderTop,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: BLACK },
  backButton: { padding: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 15 },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    ...SHADOW.card,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  orderIdText: { fontSize: 14, fontWeight: '700', color: BLACK },
  statusBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  orderBody: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  placeholderImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  orderMainInfo: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 14, fontWeight: '700', color: BLACK, marginBottom: 4 },
  productMeta: { fontSize: 12, color: '#666', marginBottom: 4 },
  dateText: { fontSize: 12, color: MUTED },
  orderFooter: { borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 15 },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: { fontSize: 14, color: '#666' },
  totalValue: { fontSize: 20, fontWeight: '800', color: BLACK },
  actionButton: {
    backgroundColor: BLACK,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: BLACK, marginTop: 15 },
  emptySub: { fontSize: 14, color: MUTED, marginTop: 5, textAlign: 'center', paddingHorizontal: 40 },
});

export default OrdersListScreen;
