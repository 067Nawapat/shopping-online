import { StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from './theme';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: SPACING.screenHeaderTop,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  amountContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  amountText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.black,
  },
  qrContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    ...SHADOW.strong,
    alignItems: 'center',
    marginBottom: 30,
  },
  thaiQrImage: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  promptPayImage: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 40,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
  },
  button: {
    height: 54,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: COLORS.black,
  },
  uploadButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  confirmButton: {
    backgroundColor: COLORS.accent,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  whiteText: {
    color: COLORS.white,
  },
  blackText: {
    color: COLORS.black,
  },
  grayText: {
    color: '#999',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
  },
  slipPreview: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  }
});
