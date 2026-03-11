import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import styles from '../styles/AuthScreen.styles';

const AuthScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111111" />
      <View style={styles.content}>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>SA_</Text>
          <Text style={styles.logoText}>SOM</Text>
        </View>

        {/* Tagline */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>The authentic</Text>
          <Text style={styles.titleText}>
            <Text style={styles.titleAccent}>premium</Text> marketplace
          </Text>
          <Text style={styles.titleText}>for every</Text>
          <Text style={styles.titleText}>lifestyle.</Text>
        </View>

        {/* Social Login Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
            <AntDesign name="google" size={20} color="#EA4335" />
            <Text style={styles.socialBtnText}>ดำเนินการต่อด้วย Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
            <FontAwesome name="facebook-square" size={20} color="#1877F2" />
            <Text style={styles.socialBtnText}>ดำเนินการต่อด้วย Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
            <AntDesign name="apple1" size={20} color="#fff" />
            <Text style={styles.socialBtnText}>ดำเนินการต่อด้วย Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emailBtn}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}
          >
            <Text style={styles.emailBtnText}>สมัครสมาชิกด้วยอีเมล</Text>
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.loginText}>มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
