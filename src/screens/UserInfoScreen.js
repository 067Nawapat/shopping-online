import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../api/apiService';
import styles from '../styles/UserInfoScreen.styles';

// ── Gender Options ─────────────────────────────────────────
const GENDERS = ['ชาย', 'หญิง', 'ไม่ระบุ'];

const UserInfoScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [nameFocused, setNameFocused] = useState(false);

  useEffect(() => { loadUserData(); }, []);

  const loadUserData = async () => {
    const userData = await apiService.getUser();
    if (userData) {
      setUser(userData);
      setName(userData.name || '');
      setEmail(userData.email || '');
      setBirthDate(userData.birthDate || '');
      setGender(userData.gender || '');
    }
  };

  const handleUpdate = () => {
    if (!name.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกชื่อของคุณ');
      return;
    }
    // TODO: เรียก API อัปเดตข้อมูลจริง
    Alert.alert('สำเร็จ ✅', 'แก้ไขข้อมูลส่วนตัวเรียบร้อยแล้ว', [
      { text: 'ตกลง', onPress: () => navigation.goBack() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'ลบบัญชี',
      'การลบบัญชีจะไม่สามารถกู้คืนได้ คุณแน่ใจหรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบบัญชี',
          style: 'destructive',
          onPress: () => Alert.alert('แจ้งเตือน', 'ฟีเจอร์นี้กำลังพัฒนา'),
        },
      ],
    );
  };

  if (!user) return null;

  // แสดงตัวอักษรย่อ
  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SA';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#0D0D0D" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>โปรไฟล์</Text>
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Avatar ── */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.emailHeader}>{email}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#CCFF00" />
            <Text style={styles.verifiedText}>ยืนยันแล้ว</Text>
          </View>

          {/* ── Form ── */}
          <View style={styles.form}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ชื่อ</Text>
              <TextInput
                style={[styles.input, nameFocused && { borderColor: '#0D0D0D' }]}
                value={name}
                onChangeText={setName}
                placeholder="กรอกชื่อของคุณ"
                placeholderTextColor="#AAA"
                returnKeyType="done"
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>

            {/* Email (read-only) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>อีเมล</Text>
              <View style={[styles.input, styles.disabledInput]}>
                <Text style={{ color: '#AAA', fontSize: 16 }}>{email}</Text>
              </View>
            </View>

            {/* Birth Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>วันเกิด</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() =>
                  Alert.alert('วันเกิด', 'Date picker กำลังพัฒนา')
                }
              >
                <Text style={{ color: birthDate ? '#0D0D0D' : '#AAA', fontSize: 16 }}>
                  {birthDate || 'เลือกวันเกิด'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>เพศ</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {GENDERS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.input,
                      { flex: 1, alignItems: 'center' },
                      gender === g && { borderColor: '#0D0D0D', backgroundColor: '#0D0D0D' },
                    ]}
                    onPress={() => setGender(g)}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: gender === g ? '#fff' : '#555',
                      }}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* ── Footer Buttons ── */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
            <Text style={styles.deleteBtnText}>ลบบัญชี</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
            <Text style={styles.saveBtnText}>บันทึกการเปลี่ยนแปลง</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserInfoScreen;
