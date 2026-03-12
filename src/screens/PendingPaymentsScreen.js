import React, { useState, useEffect, useCallback } from 'react';
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
import { SPACING } from '../styles/theme';

const PendingPaymentsScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userData = await apiService.getUser();
      if (userData) {
        setUser(userData);
        const data = await apiService.getOrders(userData.id);
        // กรองเฉพาะออเดอร์ที่สถานะเป็น pending (ที่ต้องชำระ)
        const pendingOrders = data.filter(order => order.status === 'pending');
        setOrders(pendingOrders || []);
      }
    } catch (error) {
      console.error('Fetch pending orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {

    const totalPrice = Number(item.total_price || 0);
    const orderDate = item.created_at
      ? new Date(item.created_at).toLocaleDateString("th-TH")
      : "-";

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() =>
          navigation.navigate("PaymentPromptPay", {
            orderId: item.id,
            totalPrice: totalPrice,
          })
        }
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderIdText}>
            หมายเลขคำสั่งซื้อ #{item.id}
          </Text>

          <Text style={styles.pendingBadge}>รอการชำระเงิน</Text>
        </View>

        <View style={styles.orderBody}>
          <View style={styles.placeholderImg}>
            <Ionicons name="cube-outline" size={30} color="#DDD" />
          </View>

          <View style={styles.orderMainInfo}>
            <Text style={styles.dateText}>
              วันที่สั่งซื้อ: {orderDate}
            </Text>

            <Text style={styles.clickHint}>
              แตะเพื่อดู QR Code และชำระเงิน
            </Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>ยอดรวมสุทธิ</Text>

            <Text style={styles.totalValue}>
              ฿{totalPrice.toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.payButton}
            onPress={() =>
              navigation.navigate("PaymentPromptPay", {
                orderId: item.id,
                totalPrice: totalPrice,
              })
            }
          >
            <Text style={styles.payButtonText}>ชำระเงินตอนนี้</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ที่ต้องชำระ</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={BLACK} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="wallet-outline" size={64} color="#DDD" />
          <Text style={styles.emptyTitle}>ไม่มีรายการที่ต้องชำระ</Text>
          <Text style={styles.emptySub}>คุณยังไม่มีคำสั่งซื้อที่รอการชำระเงินในขณะนี้</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BLACK,
  },
  backButton: {
    padding: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 15,
  },
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
  orderIdText: {
    fontSize: 14,
    fontWeight: '700',
    color: BLACK,
  },
  pendingBadge: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '700',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  orderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
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
  orderMainInfo: {
    flex: 1,
    marginLeft: 15,
  },
  dateText: {
    fontSize: 12,
    color: MUTED,
    marginBottom: 4,
  },
  clickHint: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 15,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: BLACK,
  },
  payButton: {
    backgroundColor: BLACK,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BLACK,
    marginTop: 15,
  },
  emptySub: {
    fontSize: 14,
    color: MUTED,
    marginTop: 5,
  },
});

// Mock SHADOW constant since it's used in styles
const SHADOW = {
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    }
};

export default PendingPaymentsScreen;
