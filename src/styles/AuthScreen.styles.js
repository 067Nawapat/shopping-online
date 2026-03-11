import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from './theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },

  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Logo ─────────────────────────────────────────────────
  logoContainer: {
    marginBottom: SPACING.xxl,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 40,
    color: COLORS.white,
  },
  logoDot: {
    color: COLORS.accent,
  },

  // ── Tagline ──────────────────────────────────────────────
  titleContainer: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    marginBottom: SPACING.xxl + 10,
  },
  titleText: {
    fontSize: FONTS.xxl,
    fontWeight: '300',
    textAlign: 'left',
    lineHeight: 46,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  titleAccent: {
    color: COLORS.accent,
    fontWeight: '700',
  },

  // ── Buttons ──────────────────────────────────────────────
  buttonContainer: { width: '100%', gap: 10 },

  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  socialBtnText: {
    fontSize: FONTS.base,
    fontWeight: '600',
    marginLeft: SPACING.sm,
    color: COLORS.white,
  },

  emailBtn: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  emailBtnText: {
    fontSize: FONTS.base,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: 0.3,
  },

  // ── Login Link ───────────────────────────────────────────
  loginBtn: {
    marginTop: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  loginText: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.white,
    textDecorationLine: 'underline',
    textDecorationColor: COLORS.accent,
  },
});
