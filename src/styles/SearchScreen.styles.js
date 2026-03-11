import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from './theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  // ── Category Tab Bar (Pill Badges) ────────────────────────
  tabBar: {
    backgroundColor: COLORS.white,
    paddingTop: 56,
    paddingBottom: SPACING.md,
  },
  tabScrollContent: {
    paddingHorizontal: SPACING.base,
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
  activeTab: { backgroundColor: COLORS.black },
  tabText: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: '700' },
  activeTabText: { color: COLORS.white },

  // ── Brand Strip ──────────────────────────────────────────
  brandContainer: { backgroundColor: COLORS.white, paddingVertical: SPACING.md },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D0D0D',
    marginLeft: SPACING.base,
    marginBottom: 12,
  },
  brandItem: { width: 72, alignItems: 'center', marginRight: 16 },
  brandIconPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: 'transparent', // ไม่มีพื้นหลังตามสไตล์ใหม่
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandName: { fontSize: 12, color: '#4A4A4A', textAlign: 'center', fontWeight: '500' },

  // ── Filter Bar ───────────────────────────────────────────
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  filterScrollContent: { paddingHorizontal: SPACING.base },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    marginRight: 8,
  },
  activeFilter: { backgroundColor: COLORS.black },
  filterText: { fontSize: FONTS.sm, marginLeft: 6, color: COLORS.textSecondary, fontWeight: '600' },
  activeFilterText: { color: COLORS.white },
  filterIconBtn: { paddingHorizontal: SPACING.base },

  // ── Product Grid ─────────────────────────────────────────
  productList: { padding: SPACING.sm },
  productCard: {
    flex: 1,
    margin: SPACING.xs,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  productImageContainer: { width: '100%', aspectRatio: 1, backgroundColor: COLORS.bg },
  productImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  soldBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  soldText: { fontSize: FONTS.xs, color: COLORS.textSecondary, marginLeft: 2, fontWeight: '600' },

  productInfo: { padding: SPACING.sm },
  productBrand: { fontSize: FONTS.sm, fontWeight: '800', color: COLORS.textPrimary },
  productName: { fontSize: FONTS.xs, color: COLORS.textSecondary, lineHeight: 18, marginVertical: 3, minHeight: 32 },
  priceContainer: { marginTop: 4 },
  priceLabel: { fontSize: FONTS.xs, color: COLORS.textMuted },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  priceValue: { fontSize: FONTS.base, fontWeight: '800', color: COLORS.textPrimary, marginRight: 3 },

  heartBtn: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    padding: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
