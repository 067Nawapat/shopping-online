import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from './theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  backBtn: { paddingHorizontal: SPACING.base, paddingTop: SPACING.screenHeaderTop, paddingBottom: SPACING.sm },

  content: { paddingHorizontal: SPACING.lg, paddingBottom: 100 },

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
  inputWrapperFocused: { borderColor: COLORS.black },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: FONTS.base,
    color: COLORS.textPrimary,
  },
  eyeBtn: { padding: SPACING.xs },

  // ── Password Strength ────────────────────────────────────
  strengthBar: { flexDirection: 'row', marginTop: 6, gap: 4 },
  strengthSegment: { flex: 1, height: 3, borderRadius: 2, backgroundColor: COLORS.border },
  strengthWeak: { backgroundColor: COLORS.danger },
  strengthMedium: { backgroundColor: COLORS.warning },
  strengthStrong: { backgroundColor: COLORS.success },
  strengthLabel: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 4 },

  // ── Register Button ──────────────────────────────────────
  registerBtn: {
    backgroundColor: COLORS.black,
    borderRadius: RADIUS.sm,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  registerBtnDisabled: { backgroundColor: COLORS.textMuted },
  registerBtnText: { color: COLORS.white, fontSize: FONTS.base, fontWeight: '700', letterSpacing: 0.5 },

  // ── Footer ───────────────────────────────────────────────
  footerText: { textAlign: 'center', marginTop: SPACING.lg, color: COLORS.textMuted, fontSize: FONTS.sm },
  linkText: { color: COLORS.textPrimary, fontWeight: '700' },
});
