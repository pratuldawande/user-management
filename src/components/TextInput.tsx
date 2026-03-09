import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '../theme/colors';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyles?: StyleProp<ViewStyle>;
};

const TextInput = ({
  label,
  error,
  helperText,
  style,
  containerStyles,
  ...props
}: Props) => {
  return (
    <View style={[styles.container, containerStyles]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <RNTextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.textHint}
        {...props}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.danger,
  },
  helperText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
  },
});

export default TextInput;
