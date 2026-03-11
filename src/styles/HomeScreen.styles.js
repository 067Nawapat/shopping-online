import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from './theme';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  // ── Header (App Store Style) ────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.screenHeaderTop,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 34, // ขนาดใหญ่แบบ App Store
    fontWeight: '800',
    color: COLORS.black,
    letterSpacing: -0.5,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#CCFF00', // สีเขียว SASOM สำหรับตัวอักษร
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },

  // ── Category Tab Bar (Pill Badges) ──────────────────────
  tabBar: {
    backgroundColor: COLORS.white,
    paddingBottom: SPACING.md,
  },
  tabScrollContent: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.xs,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: RADIUS.full,
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: COLORS.black,
  },
  tabText: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: '700' },
  activeTabText: { color: COLORS.white },

  // ── Banner (App Store Card) ─────────────────────────────
  bannerContainer: {
    width: width - SPACING.base * 2,
    height: 400, // สูงขึ้นเพื่อเป็นหน้าปกใหญ่
    backgroundColor: COLORS.bgDark,
    borderRadius: 20,
    marginHorizontal: SPACING.base,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    ...SHADOW.strong,
  },
  bannerImage: { width: '100%', height: '100%', position: 'absolute' },
  bannerOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    height: '60%',
  },
  bannerCategory: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.xs, fontWeight: '700', marginBottom: 4 },
  bannerTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 6,
  },
  bannerSub: { color: 'rgba(255,255,255,0.85)', fontSize: FONTS.sm, marginTop: 2 },

  bannerOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bannerIcon: { width: 44, height: 44, borderRadius: 10 },
  bannerAppInfo: { flex: 1, marginLeft: 12 },
  bannerAppName: { color: COLORS.white, fontSize: FONTS.sm, fontWeight: '700' },
  bannerAppSub: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.xs, marginTop: 2 },
  bannerBtn: { padding: 6 },

  // ── Quick Actions (2-Rows Scrollable, No Border) ────────────────────────
  quickActionsContainer: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
  },
  actionItem: {
    width: 68, // กำหนดความกว้างชัดเจนให้เลื่อนง่าย
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 16,
  },
  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'transparent', // ลบพื้นหลังเทาออกให้เป็นโปร่งใส
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 10,
    textAlign: 'center',
    color: '#4A4A4A',
    fontWeight: '500',
  },

  // ── Promo Section ────────────────────────────────────────
  promoSection: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.xs,
    padding: SPACING.base,
  },
  promoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  promoTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.textPrimary, flex: 1 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center' },
  viewAllText: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  promoSubTitle: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },

  // ── Product Scroll Cards ──────────────────────────────────
  productScroll: {},
  productCard: {
    width: 130,
    height: 175,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    marginRight: SPACING.sm,
    padding: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  productRank: {
    position: 'absolute',
    top: 8,
    left: 10,
    fontSize: FONTS.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    opacity: 0.15,
  },
  productImage: { width: 90, height: 90, marginTop: 24, resizeMode: 'contain' },

  // ── Feed Grid ────────────────────────────────────────────
  feedSection: {
    backgroundColor: COLORS.white,
    padding: SPACING.base,
  },
  feedTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },
  feedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  feedCard: {
    width: (width - SPACING.base * 2 - 12) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    ...SHADOW.card,
  },
  feedImageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedProductImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  feedSoldBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  feedSoldText: { fontSize: 10, color: '#22C55E', fontWeight: '600', marginLeft: 2 },
  feedContent: {
    padding: 10,
  },
  feedBrand: { fontSize: 14, fontWeight: '700', color: COLORS.black },
  feedName: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2, height: 32 },
  feedPriceContainer: { marginTop: 8 },
  feedPriceLabel: { fontSize: 10, color: '#AAA' },
  feedPriceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  feedPrice: { fontSize: 16, fontWeight: '800', color: COLORS.black },
  feedHeartBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
    ...SHADOW.sm,
  },

  // ── Section Separator ────────────────────────────────────
  sectionSpacer: { height: SPACING.xs, backgroundColor: COLORS.bg },
});
