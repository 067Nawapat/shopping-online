import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../api/apiService';
import styles from '../styles/ProfileScreen.styles';
import { StatusItem, MenuItem } from '../components/ProfileComponents';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', checkUser);
    return unsubscribe;
  }, [navigation]);

  const checkUser = useCallback(async () => {
    const userData = await apiService.getUser();
    if (!userData) {
      navigation.navigate('Auth');
    } else {
      setUser(userData);
    }
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert('ออกจากระบบ', 'คุณต้องการออกจากระบบใช่หรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ออกจากระบบ',
        style: 'destructive',
        onPress: async () => {
          await apiService.logout();
          setUser(null);
          navigation.navigate('Auth');
        },
      },
    ]);
  };

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SA';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Profile Header (Dark) ── */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name || 'SASOM User'}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#CCFF00" />
              <Text style={styles.verifiedText}>ยืนยันแล้ว</Text>
            </View>
          </View>
        </View>

        {/* ── Order Status ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>การซื้อ</Text>
            <TouchableOpacity style={styles.viewHistory}>
              <Text style={styles.historyText}>ดูประวัติ</Text>
              <Ionicons name="chevron-forward" size={12} color="#CCC" />
            </TouchableOpacity>
          </View>
          <View style={styles.statusGrid}>
            <StatusItem icon="clipboard-list-outline" label="กำลังตั้งรับ" />
            <StatusItem icon="clock-outline" label="รอเป้าหมาย" />
            <StatusItem icon="file-search-outline" label="ตรวจสอบ" />
            <StatusItem icon="truck-delivery-outline" label="จัดส่ง" />
            <StatusItem icon="close-circle-outline" label="ยกเลิก" />
          </View>
          <TouchableOpacity style={styles.tierCard}>
            <Ionicons name="sparkles" size={22} color="#CCFF00" style={styles.tierIcon} />
            <Text style={styles.tierName}>เทียร์ Explorer</Text>
            <View style={styles.tierReward}>
              <Text style={styles.rewardText}>ดูรางวัล</Text>
              <Ionicons name="chevron-forward" size={12} color="#555" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Account ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>บัญชี</Text>
          </View>
          <MenuItem
            icon="person-outline"
            label="ข้อมูลส่วนตัว"
            onPress={() => navigation.navigate('UserInfo')}
          />
          <MenuItem
            icon="ticket-outline"
            label="โค้ดส่วนลดและดีล"
            onPress={() => navigation.navigate('Coupons')}
          />
        </View>

        {/* ── Settings ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>การตั้งค่า</Text>
          </View>
          <MenuItem
            icon="location-outline"
            label="ที่อยู่จัดส่ง"
            onPress={() => navigation.navigate('AddressList')}
          />
          <MenuItem
            icon="card-outline"
            label="วิธีการชำระเงิน"
            onPress={() => Alert.alert('Payment', 'Coming soon')}
          />
          <MenuItem
            icon="notifications-outline"
            label="การแจ้งเตือน"
            onPress={() => Alert.alert('Notifications', 'Coming soon')}
          />
        </View>

        {/* ── Support ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ช่วยเหลือ</Text>
          </View>
          <MenuItem
            icon="help-circle-outline"
            label="ศูนย์ช่วยเหลือ"
            onPress={() => Alert.alert('Help', 'Coming soon')}
          />
          <MenuItem
            icon="chatbubble-outline"
            label="ติดต่อเรา"
            onPress={() => Alert.alert('Contact', 'Coming soon')}
          />
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>ออกจากระบบ</Text>
          <Text style={styles.versionText}>เวอร์ชัน 1.0.0</Text>
        </TouchableOpacity>

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
