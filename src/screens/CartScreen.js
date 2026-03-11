import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BLACK, MUTED } from '../utils/constants';

const CartScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Ionicons name="cart-outline" size={64} color="#DDD" />
      <Text style={styles.title}>ตะกร้าสินค้า</Text>
      <Text style={styles.sub}>รถเข็นของคุณยังว่างเปล่า</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: '700', color: BLACK, marginTop: 16 },
  sub: { fontSize: 14, color: MUTED, marginTop: 6 },
});

export default CartScreen;
