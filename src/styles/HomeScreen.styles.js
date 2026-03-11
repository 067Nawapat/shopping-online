import { Dimensions, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from './theme';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  header: {
    backgroundColor: COLORS.white,
    paddingTop: SPACING.screenHeaderTop,
    paddingBottom: SPACING.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: -1,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#CCFF00', // Neon yellow from SASOM
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
  },

  shortcutScroll: {
    paddingLeft: 20,
  },
  shortcutList: {
    paddingRight: 20,
    paddingBottom: 10,
  },
  shortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    marginRight: 10,
  },
  shortcutCardActive: {
    backgroundColor: '#000',
  },
  shortcutIcon: {
    marginRight: 0, // No icons in SASOM style categories
    display: 'none',
  },
  shortcutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#777',
  },
  shortcutTitleActive: {
    color: '#FFF',
  },

  bannerSection: {
    paddingTop: 10,
  },
  bannerDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  bannerDotActive: {
    width: 20,
    backgroundColor: '#000',
  },

  feedSection: {
    backgroundColor: COLORS.white,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 2,
  },
  feedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  feedCard: {
    width: (width - 40 - 15) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  feedImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    overflow: 'hidden',
  },
  feedProductImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  feedSoldBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  feedSoldText: {
    fontSize: 11,
    color: '#000',
    fontWeight: '700',
  },
  feedContent: {
    paddingVertical: 12,
  },
  feedBrand: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.black,
  },
  feedName: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  feedPriceContainer: {
    marginTop: 8,
  },
  feedPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.black,
  },
});
