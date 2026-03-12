import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import generatePayload from 'promptpay-qr';
import QRCode from 'react-native-qrcode-svg';
import * as ImagePicker from 'expo-image-picker';
import { apiService } from '../api/apiService';
import styles from '../styles/PaymentPromptPayScreen.styles';

const PaymentPromptPayScreen = ({ route, navigation }) => {
  const { orderId, totalPrice } = route.params;
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [slipImage, setSlipImage] = useState(null);
  const qrRef = useRef();

  const payload = generatePayload("0926631047", {
    amount: parseFloat(totalPrice)
  });

  const saveQrCode = () => {
    // ในที่นี้สมมติว่าเป็นการบันทึกจำลอง หรือแจ้งเตือน เนื่องจากต้องใช้สิทธิ์การเข้าถึงคลังภาพ
    Alert.alert("สำเร็จ", "บันทึก QR Code ลงในเครื่องเรียบร้อยแล้ว");
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('ขออภัย', 'เราต้องการสิทธิ์การเข้าถึงคลังภาพเพื่ออัปโหลดสลิป');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSlipImage(result.assets[0].uri);
    }
  };

  const handleConfirmPayment = async () => {
    if (!slipImage) {
      Alert.alert("แจ้งเตือน", "กรุณาอัปโหลดสลิปการโอนเงินก่อนยืนยัน");
      return;
    }

    setChecking(true);
    try {
      const res = await apiService.uploadSlip(orderId, slipImage);
      if (res.status === 'success') {
        // จำลองการตรวจสอบ 2 วินาที
        setTimeout(() => {
          setChecking(false);
          Alert.alert("สำเร็จ", "ระบบได้รับข้อมูลการชำระเงินแล้ว กำลังตรวจสอบ", [
            { text: "ตกลง", onPress: () => navigation.navigate('MainTabs') }
          ]);
        }, 2000);
      } else {
        setChecking(false);
        Alert.alert("ผิดพลาด", "ไม่สามารถอัปโหลดสลิปได้");
      }
    } catch (error) {
      setChecking(false);
      console.error(error);
      Alert.alert("ผิดพลาด", "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {checking && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>ระบบกำลังตรวจสอบการชำระเงิน...</Text>
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ชำระเงิน</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instructionText}>
          กรุณาสแกนจ่ายหรือบันทึกรูปภาพ QR{"\n"}เพื่ออัปโหลดผ่านแอปพลิเคชันธนาคารของคุณ
        </Text>

        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>฿{parseFloat(totalPrice).toLocaleString()}</Text>
        </View>

        <View style={styles.qrContainer}>
          <Image source={require('../../assets/thai_qr_payment.png')} style={styles.thaiQrImage} />
          <Image source={require('../../assets/promptpay_logo.png')} style={styles.promptPayImage} />
          
          <View style={styles.qrWrapper}>
            <QRCode
              value={payload}
              size={220}
              getRef={(c) => (qrRef.current = c)}
            />
          </View>
        </View>

        {slipImage && (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#22C55E', fontWeight: '600' }}>อัปโหลดสลิปแล้ว</Text>
            <Image source={{ uri: slipImage }} style={styles.slipPreview} />
          </View>
        )}

        <Text style={styles.footerText}>คำสั่งซื้อจะเสร็จสมบูรณ์โดยอัตโนมัติ</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={saveQrCode}>
          <Text style={[styles.buttonText, styles.whiteText]}>บันทึก QR code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.uploadButton]} onPress={pickImage}>
          <Text style={[styles.buttonText, styles.blackText]}>
            {slipImage ? 'เปลี่ยนรูปภาพสลิป' : 'อัปโหลดสลิป'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.confirmButton, !slipImage && styles.disabledButton]} 
          onPress={handleConfirmPayment}
          disabled={!slipImage}
        >
          <Text style={[styles.buttonText, slipImage ? styles.blackText : styles.grayText]}>ยืนยันการจ่ายเงิน</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaymentPromptPayScreen;
