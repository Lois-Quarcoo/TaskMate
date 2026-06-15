import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { Flame } from 'lucide-react-native';

export const WelcomeScreen = () => {
  const { login, register, loading, error } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async () => {
    setValidationError('');
    
    if (!email || !password) {
      setValidationError('Please fill in all required fields.');
      return;
    }
    
    if (!isLogin && !username) {
      setValidationError('Please enter a username.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(username, email, password);
    }

    if (!result.success) {
      setValidationError(result.error || 'Authentication failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Flame size={40} color={COLORS.secondary} />
          </View>
          <Text style={styles.brandName}>TaskMate</Text>
          <Text style={styles.tagline}>Gamify your study, master your time</Text>
        </View>

        {/* Auth Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          
          {/* Form Fields */}
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor={COLORS.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Validation & API errors */}
          {(validationError || error) && (
            <Text style={styles.errorText}>{validationError || error}</Text>
          )}

          {/* Action button */}
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: COLORS.primary }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.background} />
            ) : (
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Log In' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Toggle between register and login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </Text>
          <TouchableOpacity onPress={() => {
            setIsLogin(!isLogin);
            setValidationError('');
          }}>
            <Text style={styles.footerLink}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.doubleLarge,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.secondary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
    ...SHADOWS.glow,
  },
  brandName: {
    color: COLORS.textPrimary,
    fontSize: 28,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    ...FONTS.regular,
    marginTop: SIZES.base,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
    ...SHADOWS.medium,
  },
  formTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.extraLarge,
    ...FONTS.semiBold,
    marginBottom: SIZES.large,
  },
  inputContainer: {
    marginBottom: SIZES.medium,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.medium,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.medium,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: COLORS.textPrimary,
    fontSize: SIZES.font,
  },
  submitButton: {
    borderRadius: SIZES.radius,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.medium,
    ...SHADOWS.glow,
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    ...FONTS.bold,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: SIZES.small,
    ...FONTS.medium,
    marginTop: SIZES.base,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.large,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  footerLink: {
    color: COLORS.secondary,
    fontSize: SIZES.font,
    ...FONTS.bold,
  }
});

export default WelcomeScreen;
