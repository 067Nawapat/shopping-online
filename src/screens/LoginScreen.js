import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../api/apiService';
import ConfirmModal from '../components/ConfirmModal';
import styles from '../styles/LoginScreen.styles';

// ── Helper ────────────────────────────────────────────────
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);

  const passwordRef = useRef(null);

  const showModal = (title, message, onConfirm = null, confirmText = 'ตกลง') => {
    setModalConfig({ title, message, onConfirm, confirmText });
  };

  const closeModal = () => {
    setModalConfig(null);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      showModal('แจ้งเตือน', 'กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    if (!isValidEmail(email.trim())) {
      showModal('แจ้งเตือน', 'รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.login(email.trim().toLowerCase(), password);
      if (response.status === 'success') {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                index: 0,
                routes: [{ name: 'หน้าหลัก' }],
              },
            },
          ],
        });
      } else {
        showModal('เข้าสู่ระบบไม่สำเร็จ', response.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch {
      showModal('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับ Server ได้\nกรุณาตรวจสอบอินเทอร์เน็ต');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#0D0D0D" />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>เข้าสู่ระบบ</Text>
            <Text style={styles.subtitle}>ยินดีต้อนรับกลับมา</Text>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>อีเมล</Text>
              <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  placeholderTextColor="#AAA"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>รหัสผ่าน</Text>
              <View style={[styles.inputWrapper, passFocused && styles.inputWrapperFocused]}>
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  placeholder="ระบุรหัสผ่าน"
                  placeholderTextColor="#AAA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword((v) => !v)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => showModal('ลืมรหัสผ่าน', 'ฟีเจอร์นี้กำลังพัฒนา')}
            >
              <Text style={styles.forgotText}>ลืมรหัสผ่าน?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>เข้าสู่ระบบ</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerText}>
                ยังไม่มีบัญชี?{' '}
                <Text style={styles.linkText}>สมัครสมาชิก</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={!!modalConfig}
        title={modalConfig?.title}
        message={modalConfig?.message}
        confirmText={modalConfig?.confirmText}
        hideCancel
        onConfirm={() => {
          const handler = modalConfig?.onConfirm;
          closeModal();
          if (handler) {
            handler();
          }
        }}
        onCancel={closeModal}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;
