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
import { User } from '../types/user';

type Props = {
  user: User;
  containerStyles?: StyleProp<ViewStyle>;
  onPress?: (user: User) => void;
};

const UserCard = ({ user, containerStyles, onPress }: Props) => {
  const initial = user.name.trim().charAt(0).toUpperCase() || '?';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(user)}
      style={[styles.card, containerStyles]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.name}
          >
            {user.name}
          </Text>
          <Text style={styles.type}>{user.role}</Text>
        </View>
        {user.email ? <Text style={styles.email}>{user.email}</Text> : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderMuted,
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
  },
  type: {
    fontSize: 12,
    color: colors.textSubtle,
    marginLeft: 8,
  },
});

export default React.memo(UserCard);
