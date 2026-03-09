import React, { useCallback, useMemo } from 'react';
import {
  Pressable,
  RefreshControl,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  FlatList,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';

import { colors } from '../theme/colors';

import UserCard from './UserCard';
import { User } from '../types/user';
import { Swipeable } from 'react-native-gesture-handler';

type Props = {
  users: User[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onPressItem: (user: User) => void;
  onDelete?: (user: User) => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  loadingMore?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
};

type SectionRow =
  | { type: 'header'; title: string }
  | { type: 'item'; user: User };

const Separator = () => <View style={styles.separator} />;
const EmptyState = ({ loading }: { loading: boolean }) => {
  const text = loading ? 'Loading users...' : 'No users found.';

  return (
    <View style={styles.emptyContainer}>
      {loading ? <ActivityIndicator size="large" /> : null}
      <Text style={styles.emptyState}>{text}</Text>
    </View>
  );
};

const buildSections = (users: User[]): SectionRow[] => {
  const uniqueUsers = Array.from(
    new Map(users.map(user => [user.id, user])).values(),
  );
  const sorted = uniqueUsers.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  );
  const rows: SectionRow[] = [];
  let currentHeader = '';
  sorted.forEach(user => {
    const header = user.name.trim().charAt(0).toUpperCase() || '#';
    if (header !== currentHeader) {
      currentHeader = header;
      rows.push({ type: 'header', title: header });
    }
    rows.push({ type: 'item', user });
  });
  return rows;
};

const UserList = React.forwardRef<FlatList<SectionRow>, Props>(
  (
    {
      users,
      loading,
      refreshing,
      onRefresh,
      onPressItem,
      onDelete,
      onEndReached,
      onEndReachedThreshold = 0.2,
      loadingMore = false,
      containerStyles,
    },
    ref,
  ) => {
    const data = useMemo(() => buildSections(users), [users]);

    const renderItem: ListRenderItem<SectionRow> = useCallback(
      ({ item }) => {
        const renderRightActions = (user: User) => {
          return (
            <Pressable
              style={styles.deleteButton}
              onPress={() => onDelete && onDelete(user)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          );
        };

        if (item.type === 'header') {
          return (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{item.title}</Text>
            </View>
          );
        }

        return (
          <Swipeable
            renderRightActions={() => renderRightActions(item.user)}
            overshootRight={false}
            friction={2}
          >
            <UserCard user={item.user} onPress={onPressItem} />
          </Swipeable>
        );
      },
      [onDelete, onPressItem],
    );

    return (
      <View style={[styles.container, containerStyles]}>
        <FlatList
          ref={ref}
          data={data}
          renderItem={renderItem}
          keyExtractor={item =>
            item.type === 'header' ? `header-${item.title}` : item.user.id
          }
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={<EmptyState loading={loading} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={onEndReachedThreshold}
          initialNumToRender={20}
          removeClippedSubviews
          ListFooterComponent={
            loadingMore && users.length > 0 ? (
              <Text style={styles.footerText}>Loading more...</Text>
            ) : null
          }
        />
      </View>
    );
  },
);

UserList.displayName = 'UserList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  sectionHeader: {
    paddingTop: 12,
    paddingBottom: 6,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSubtle,
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyState: {
    textAlign: 'center',
    color: colors.textMuted,
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  retryButtonText: {
    color: colors.background,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    color: colors.textSubtle,
    paddingVertical: 12,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 12,
  },

  deleteText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default UserList;
