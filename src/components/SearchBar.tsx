import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '../theme/colors';

import TextInput from './TextInput';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  containerStyles?: StyleProp<ViewStyle>;
};

const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search',
  onClear,
  containerStyles,
}: Props) => {
  return (
    <View style={[styles.container, containerStyles]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCapitalize="none"
        containerStyles={styles.inputContainer}
        style={styles.input}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            onClear?.();
            if (!onClear) {
              onChangeText('');
            }
          }}
          style={styles.clearButton}
        >
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    flex: 1,
    minHeight: 48,
    paddingVertical: 10,
    paddingRight: 64,
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.clearBg,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default SearchBar;
