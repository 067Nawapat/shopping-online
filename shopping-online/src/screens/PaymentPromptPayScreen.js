import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { apiService } from '../api/apiService';
import styles from '../styles/PaymentPromptPayScreen.styles';

const PROMPTPAY_NUMBER = '0926631047';
const TRUE_MONEY_NUMBER = '0926631047';

const METHOD_META = {
  promptpay: {
    title: 'PromptPay',
    subtitle: 'สแกน QR แล้วอัปโหลดสลิปเพื่อให้ระบบตรวจสอบอัตโนมัติ',
    icon: 'qr-code-outline',
    accent: '#003D87',
    requiresQr: true,
    targetLabel: `PromptPay ${PROMPTPAY_NUMBER}`,
  },
  true_money: {
    title: 'TrueMoney Wallet',
    subtitle: 'โอนเข้าวอลเล็ทนี้แล้วอัปโหลดสลิป ระบบจะตรวจด้วย EasySlip TrueMoney',
    icon: 'phone-portrait-outline',
    accent: '#F97316',
    requiresQr: false,
    targetLabel: `TrueMoney Wallet ${TRUE_MONEY_NUMBER}`,
  },
};

const PaymentPromptPayScreen = ({ route, navigation }) => {
  const { orderId, totalPrice, paymentMethod: paymentMethodParam = 'promptpay' } = route.params || {};
  const paymentMethod = METHOD_META[paymentMethodParam] ? paymentMethodParam : 'promptpay';
  const methodMeta = METHOD_META[paymentMethod];

  const [checking, setChecking] = useState(false);
  const [savingQr, setSavingQr] = useState(false);
  const [loadingQr, setLoadingQr] = useState(methodMeta.requiresQr);
  const [slipAsset, setSlipAsset] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [resultModal, setResultModal] = useState({
    visible: false,
    title: '',
    message: '',
    tone: 'info',
    redirectOnClose: false,
  });

  const formattedAmount = useMemo(
    () => parseFloat(totalPrice || 0).toLocaleString(),
    [totalPrice]
  );

  useEffect(() => {
    if (methodMeta.requiresQr) {
      loadPaymentQr();
    } else {
      setLoadingQr(false);
      setQrData(null);
    }
  }, [methodMeta.requiresQr, totalPrice]);

  const showResultModal = (title, message, tone = 'info', redirectOnClose = false) => {
    setResultModal({
      visible: true,
      title,
      message,
      tone,
      redirectOnClose,
    });
  };

  const closeResultModal = () => {
    const shouldGoHome = resultModal.redirectOnClose;
    setResultModal((current) => ({ ...current, visible: false }));
    if (shouldGoHome) {
      navigation.navigate('MainTabs');
    }
  };

  const loadPaymentQr = async () => {
    setLoadingQr(true);
    try {
      const res = await apiService.generatePaymentQr(totalPrice);
      console.log('Generate payment QR response:', res);
      setQrData(res?.status === 'success' ? res : null);
    } catch (error) {
      console.error('Generate payment QR error:', error);
      setQrData(null);
    } finally {
      setLoadingQr(false);
    }
  };

  const saveQrCode = async () => {
    if (!qrData?.qr_image) {
      showResultModal('ยังไม่มี QR', 'ตอนนี้ยังไม่มี QR ให้บันทึก กรุณารอให้ระบบสร้าง QR ให้เสร็จก่อน', 'danger');
      return;
    }

    setSavingQr(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        showResultModal('บันทึกไม่ได้', 'กรุณาอนุญาตให้แอปเข้าถึงคลังรูปก่อนบันทึก QR', 'danger');
        return;
      }

      const match = qrData.qr_image.match(/^data:(.+);base64,(.+)$/);
      if (!match) {
        throw new Error('QR image data is invalid');
      }

      const mimeType = match[1];
      const base64Data = match[2];
      const extension = mimeType.includes('png') ? 'png' : 'jpg';
      const baseDirectory = FileSystem.cacheDirectory || FileSystem.documentDirectory;
      if (!baseDirectory) {
        throw new Error('Device storage is unavailable');
      }

      const fileUri = `${baseDirectory}qr_${orderId}_${Date.now()}.${extension}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: 'base64',
      });
      await MediaLibrary.createAssetAsync(fileUri);

      showResultModal(
        'บันทึก QR แล้ว',
        'ระบบบันทึกรูป QR ลงในคลังภาพของเครื่องเรียบร้อยแล้ว',
        'success',
        false
      );
    } catch (error) {
      console.error('Save QR error:', error);
      showResultModal('บันทึก QR ไม่สำเร็จ', error?.message || 'เกิดข้อผิดพลาดระหว่างบันทึก QR ลงเครื่อง', 'danger');
    } finally {
      setSavingQr(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showResultModal('ต้องการสิทธิ์', 'กรุณาอนุญาตให้แอปเข้าถึงคลังภาพก่อนอัปโหลดสลิป', 'danger');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      setSlipAsset(result.assets[0]);
    }
  };

  const buildResultMessage = (res) => {
    if (res.matched) {
      return {
        title: 'ชำระเงินสำเร็จ',
        message: `ระบบตรวจสลิป ${methodMeta.title} และยืนยันคำสั่งซื้อเรียบร้อย`,
        tone: 'success',
        redirectOnClose: true,
      };
    }

    if (res.reason === 'duplicate_slip') {
      return {
        title: 'สลิปนี้ถูกใช้แล้ว',
        message: 'ระบบพบว่าสลิปหรือเลขอ้างอิงนี้ถูกใช้กับรายการอื่นไปแล้ว จึงไม่อนุญาตให้ใช้ซ้ำ',
        tone: 'warning',
        redirectOnClose: true,
      };
    }

    if (res.reason === 'mismatch') {
      return {
        title: 'ข้อมูลการโอนไม่ตรง',
        message: 'ยอดเงินหรือข้อมูลผู้รับไม่ตรงกับออเดอร์ ระบบจึงปฏิเสธรายการนี้',
        tone: 'warning',
        redirectOnClose: true,
      };
    }

    if (
      res.reason === 'invalid_image' ||
      res.reason === 'image_size_too_large' ||
      res.reason === 'invalid_payload' ||
      res.reason === 'slip_not_found' ||
      res.reason === 'qrcode_not_found'
    ) {
      return {
        title: 'ตรวจสลิปไม่ผ่าน',
        message: 'รูปสลิปไม่สมบูรณ์หรือระบบไม่พบข้อมูลธุรกรรม กรุณาใช้สลิปที่ชัดเจนกว่าเดิม',
        tone: 'danger',
        redirectOnClose: false,
      };
    }

    if (res.reason === 'token_missing') {
      return {
        title: 'อัปโหลดสลิปแล้ว',
        message: 'เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า EasySlip token จึงยืนยันอัตโนมัติไม่ได้',
        tone: 'info',
        redirectOnClose: false,
      };
    }

    return {
      title: 'อัปโหลดสลิปแล้ว',
      message: 'ระบบรับสลิปแล้ว และส่งต่อไปตรวจสอบเพิ่มเติม',
      tone: 'info',
      redirectOnClose: false,
    };
  };

  const handleConfirmPayment = async () => {
    if (!slipAsset?.uri || !slipAsset?.base64) {
      showResultModal('ยังไม่มีสลิป', 'กรุณาอัปโหลดสลิปก่อนยืนยันการชำระเงิน', 'danger');
      return;
    }

    setChecking(true);
    try {
      const res = await apiService.uploadSlip(orderId, slipAsset);
      console.log('Upload slip response:', res);

      if (res.status !== 'success') {
        throw new Error(res.message || 'ไม่สามารถอัปโหลดสลิปได้');
      }

      const resultContent = buildResultMessage(res);
      showResultModal(
        resultContent.title,
        resultContent.message,
        resultContent.tone,
        resultContent.redirectOnClose
      );
    } catch (error) {
      console.error('Upload slip error:', error);
      showResultModal(
        'อัปโหลดสลิปไม่สำเร็จ',
        error?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อระหว่างอัปโหลดสลิป',
        'danger'
      );
    } finally {
      setChecking(false);
    }
  };

  const confirmDisabled = !slipAsset?.uri || (methodMeta.requiresQr && (loadingQr || !qrData?.qr_image));
  const modalToneStyle = styles[`${resultModal.tone}Tone`];

  return (
    <SafeAreaView style={styles.container}>
      {(checking || savingQr) ? (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#0D0D0D" />
            <Text style={styles.loadingText}>
              {checking ? 'กำลังตรวจสอบการชำระเงิน...' : 'กำลังบันทึก QR ลงเครื่อง...'}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#0D0D0D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ชำระเงิน</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.metaBlock}>
          <View style={[styles.methodBadge, { backgroundColor: `${methodMeta.accent}14` }]}>
            <Ionicons name={methodMeta.icon} size={16} color={methodMeta.accent} />
            <Text style={[styles.methodBadgeText, { color: methodMeta.accent }]}>{methodMeta.title}</Text>
          </View>
          <Text style={styles.orderText}>คำสั่งซื้อ #{orderId}</Text>
          <Text style={styles.amountText}>฿{formattedAmount}</Text>
          <Text style={styles.captionText}>{methodMeta.subtitle}</Text>
        </View>

        {methodMeta.requiresQr ? (
          <View style={styles.qrContainer}>
            <View style={styles.qrBrandHeader}>
              <Image source={require('../../assets/promptpay_logo.png')} style={styles.promptPayImage} />
            </View>

            {loadingQr ? (
              <View style={styles.qrWrapper}>
                <ActivityIndicator size="large" color="#0D0D0D" />
                <Text style={styles.qrLoadingText}>กำลังสร้าง QR จาก EasySlip...</Text>
              </View>
            ) : qrData?.qr_image ? (
              <View style={styles.qrWrapper}>
                <Image source={{ uri: qrData.qr_image }} style={styles.generatedQrImage} />
              </View>
            ) : (
              <View style={styles.qrWrapper}>
                <Ionicons name="alert-circle-outline" size={32} color="#9CA3AF" />
                <Text style={styles.qrLoadingText}>ไม่สามารถสร้าง QR ได้</Text>
              </View>
            )}

            <Text style={styles.qrHint}>{methodMeta.targetLabel}</Text>
          </View>
        ) : (
          <View style={styles.walletCard}>
            <View style={styles.walletIcon}>
              <Ionicons name="wallet-outline" size={26} color={methodMeta.accent} />
            </View>
            <View style={styles.walletInfo}>
              <Text style={styles.walletTitle}>TrueMoney Wallet สำหรับรับชำระ</Text>
              <Text style={styles.walletNumber}>{TRUE_MONEY_NUMBER}</Text>
              <Text style={styles.walletCaption}>
                โอนจากแอป TrueMoney Wallet แล้วใช้สลิปเดิมอัปโหลดกลับเข้าระบบเพื่อตรวจสอบ
              </Text>
            </View>
          </View>
        )}

        <View style={styles.slipSection}>
          <View style={styles.slipHeader}>
            <Text style={styles.sectionTitle}>สลิปการโอนเงิน</Text>
            {slipAsset?.uri ? (
              <View style={styles.uploadedBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#166534" />
                <Text style={styles.uploadedBadgeText}>อัปโหลดแล้ว</Text>
              </View>
            ) : null}
          </View>

          {slipAsset?.uri ? (
            <View style={styles.slipCard}>
              <Image source={{ uri: slipAsset.uri }} style={styles.slipPreview} />
              <Text style={styles.scanStatusText}>
                ระบบจะส่งรูปสลิปนี้ไปตรวจสอบกับ EasySlip โดยตรง
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.emptySlipCard} activeOpacity={0.85} onPress={pickImage}>
              <Ionicons name="cloud-upload-outline" size={28} color="#9CA3AF" />
              <Text style={styles.emptySlipTitle}>ยังไม่ได้อัปโหลดสลิป</Text>
              <Text style={styles.emptySlipText}>แตะเพื่อเลือกรูปจากคลังภาพ</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {methodMeta.requiresQr ? (
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={saveQrCode}>
            <Ionicons name="download-outline" size={18} color="#FFFFFF" />
            <Text style={[styles.buttonText, styles.whiteText]}>บันทึก QR Code</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={[styles.button, styles.uploadButton]} onPress={pickImage}>
          <Ionicons
            name={slipAsset?.uri ? 'image-outline' : 'cloud-upload-outline'}
            size={18}
            color="#0D0D0D"
          />
          <Text style={[styles.buttonText, styles.blackText]}>
            {slipAsset?.uri ? 'เปลี่ยนรูปสลิป' : 'อัปโหลดสลิป'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.confirmButton, confirmDisabled && styles.disabledButton]}
          onPress={handleConfirmPayment}
          disabled={confirmDisabled}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={18}
            color={!confirmDisabled ? '#0D0D0D' : '#8B8B8B'}
          />
          <Text style={[styles.buttonText, !confirmDisabled ? styles.blackText : styles.grayText]}>
            ยืนยันการชำระเงิน
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={resultModal.visible}
        transparent
        animationType="fade"
        onRequestClose={closeResultModal}
      >
        <View style={styles.resultOverlay}>
          <View style={styles.resultCard}>
            <View style={[styles.resultIconWrap, modalToneStyle]}>
              <Ionicons
                name={
                  resultModal.tone === 'success'
                    ? 'checkmark'
                    : resultModal.tone === 'warning'
                      ? 'close'
                      : 'information'
                }
                size={22}
                color="#FFFFFF"
              />
            </View>
            <Text style={styles.resultTitle}>{resultModal.title}</Text>
            <Text style={styles.resultMessage}>{resultModal.message}</Text>
            <TouchableOpacity style={styles.resultButton} onPress={closeResultModal}>
              <Text style={styles.resultButtonText}>ตกลง</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PaymentPromptPayScreen;
