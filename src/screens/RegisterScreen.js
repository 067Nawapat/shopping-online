import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../api/apiService';
import styles from '../styles/RegisterScreen.styles';

// ── Helpers ───────────────────────────────────────────────
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getPasswordStrength = (pw) => {
  if (pw.length < 6) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 3);
};

const STRENGTH_LABELS = ['', 'อ่อน', 'ปานกลาง', 'แข็งแรง'];
const STRENGTH_COLORS = ['', '#EF4444', '#F59E0B', '#22C55E'];

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const emailRef = useRef(null);
  const passRef = useRef(null);
  const confirmRef = useRef(null);

  const strength = getPasswordStrength(password);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert('ข้อผิดพลาด', 'รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }
    if (password.length < 6) {
      Alert.alert('ข้อผิดพลาด', 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('ข้อผิดพลาด', 'รหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      if (response.status === 'success') {
        Alert.alert('สำเร็จ 🎉', 'สมัครสมาชิกเรียบร้อยแล้ว', [
          { text: 'เข้าสู่ระบบ', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('สมัครไม่สำเร็จ', response.message || 'เกิดข้อผิดพลาดในการสมัคร');
      }
    } catch {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับ Server ได้\nกรุณาตรวจสอบอินเทอร์เน็ต');
    } finally {
      setLoading(false);
    }
  };

  const inputWrapper = (field) => [
    styles.inputWrapper,
    focusedField === field && styles.inputWrapperFocused,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0D0D0D" />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>สมัครสมาชิก</Text>
          <Text style={styles.subtitle}>สร้างบัญชีใหม่ของคุณ</Text>

          {/* Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ชื่อ-นามสกุล</Text>
            <View style={inputWrapper('name')}>
              <TextInput
                style={styles.input}
                placeholder="ชื่อของคุณ"
                placeholderTextColor="#AAA"
                value={name}
                onChangeText={setName}
                returnKeyType="next"
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>อีเมล</Text>
            <View style={inputWrapper('email')}>
              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="example@email.com"
                placeholderTextColor="#AAA"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                onSubmitEditing={() => passRef.current?.focus()}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>รหัสผ่าน</Text>
            <View style={inputWrapper('pass')}>
              <TextInput
                ref={passRef}
                style={styles.input}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                placeholderTextColor="#AAA"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                returnKeyType="next"
                onFocus={() => setFocusedField('pass')}
                onBlur={() => setFocusedField(null)}
                onSubmitEditing={() => confirmRef.current?.focus()}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass((v) => !v)}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
              </TouchableOpacity>
            </View>
            {/* Password Strength */}
            {password.length > 0 && (
              <>
                <View style={styles.strengthBar}>
                  {[1, 2, 3].map((level) => (
                    <View
                      key={level}
                      style={[
                        styles.strengthSegment,
                        strength >= level && { backgroundColor: STRENGTH_COLORS[strength] },
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthLabel, { color: STRENGTH_COLORS[strength] }]}>
                  {STRENGTH_LABELS[strength]}
                </Text>
              </>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ยืนยันรหัสผ่าน</Text>
            <View style={inputWrapper('confirm')}>
              <TextInput
                ref={confirmRef}
                style={styles.input}
                placeholder="ระบุรหัสผ่านอีกครั้ง"
                placeholderTextColor="#AAA"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                returnKeyType="done"
                onFocus={() => setFocusedField('confirm')}
                onBlur={() => setFocusedField(null)}
                onSubmitEditing={handleRegister}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm((v) => !v)}>
                <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerBtnText}>สมัครสมาชิก</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>
              มีบัญชีอยู่แล้ว? <Text style={styles.linkText}>เข้าสู่ระบบ</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
