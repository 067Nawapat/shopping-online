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
    paddingTop: SPACING.headerTop + 12,
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

  // ── Section Separator ────────────────────────────────────
  sectionSpacer: { height: SPACING.xs, backgroundColor: COLORS.bg },
});
