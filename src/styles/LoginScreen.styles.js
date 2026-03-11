import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from './theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  backBtn: { paddingHorizontal: SPACING.base, paddingTop: SPACING.headerTop + 6, paddingBottom: SPACING.sm },

  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xs },

  title: {
    fontSize: FONTS.xl,
    fontWeight: '800',
    marginBottom: SPACING.xs,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONTS.base,
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
  },

  // ── Inputs ───────────────────────────────────────────────
  inputContainer: { marginBottom: SPACING.base },
  label: {
    fontSize: FONTS.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  inputWrapperFocused: {
    borderColor: COLORS.black,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: FONTS.base,
    color: COLORS.textPrimary,
  },
  eyeBtn: { padding: SPACING.xs },

  // ── Forgot Password ──────────────────────────────────────
  forgotBtn: { alignSelf: 'flex-end', marginTop: -SPACING.xs, marginBottom: SPACING.lg },
  forgotText: { fontSize: FONTS.sm, color: COLORS.textSecondary, fontWeight: '600' },

  // ── Login Button ─────────────────────────────────────────
  loginBtn: {
    backgroundColor: COLORS.black,
    borderRadius: RADIUS.sm,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  loginBtnDisabled: { backgroundColor: COLORS.textMuted },
  loginBtnText: { color: COLORS.white, fontSize: FONTS.base, fontWeight: '700', letterSpacing: 0.5 },

  // ── Footer ───────────────────────────────────────────────
  footerText: { textAlign: 'center', marginTop: SPACING.lg, color: COLORS.textMuted, fontSize: FONTS.sm },
  linkText: { color: COLORS.textPrimary, fontWeight: '700' },
});
