import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { User, UserTab } from '../../types/user';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParam } from '../../navigation';
import PagerView from 'react-native-pager-view';
import { colors } from '../../theme/colors';
import { Tabs, SearchBar, UserList, AddButton } from '../../components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useUserContext } from '../../context/UserContext';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const tabs: { key: UserTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'ADMIN', label: 'Admin' },
  { key: 'MANAGER', label: 'Manager' },
];

interface Props {
  navigation: NativeStackNavigationProp<RootStackParam, 'UserListScreen'>;
}

const UserListScreen = ({ navigation }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState('');
  const pagerRef = useRef<PagerView>(null);
  const position = useRef(new Animated.Value(0)).current;
  const offset = useRef(new Animated.Value(0)).current;
  const [skip, setSkip] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const allListRef = useRef<FlatList<any>>(null);
  const adminListRef = useRef<FlatList<any>>(null);
  const managerListRef = useRef<FlatList<any>>(null);
  const [isrefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const { users, loading, error, hasMore, getUsers, deleteUser,getUsersFromAWS } =
    useUserContext();


  useEffect(() => {
    const fetchData = async () => {
    try {
      if (!isSyncing) {
        await getUsersFromAWS();
        setIsSyncing(true);
      }

      setSkip(0);
      await getUsers({ searchTerm: search, limit: 15, offset: 0 });

    // eslint-disable-next-line no-catch-shadow
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, getUsers]);

  const allFiltered = useMemo(() => {
    return users;
  }, [users]);

  const adminFiltered = useMemo(() => {
    return users.filter(user => user.role === 'ADMIN');
  }, [users]);

  const managerFiltered = useMemo(() => {
    return users.filter(user => user.role === 'MANAGER');
  }, [users]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore && !loadingMore) {
      setLoadingMore(true);
      try {
        const newSkip = skip + 15;
        setSkip(newSkip);
        await getUsers({ searchTerm: search, limit: 15, offset: newSkip });
      } finally {
        setLoadingMore(false);
      }
    }
  }, [loading, hasMore, loadingMore, skip, search, getUsers]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await getUsersFromAWS();
    setSkip(0);
    await getUsers({ searchTerm: search, limit: 15, offset: 0 });
    setIsRefreshing(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUsers, search]);

  const handleTabPress = useCallback(
    (index: number) => {
      const nextTab = tabs[index];
      if (!nextTab) {
        return;
      }
      setActiveIndex(index);
      pagerRef.current?.setPage(index);
    },
    [setActiveIndex],
  );

  const handlePageSelected = useCallback(
    (event: { nativeEvent: { position: number } }) => {
      const index = event.nativeEvent.position;
      setActiveIndex(index);
    },
    [setActiveIndex],
  );

  const handlePageScroll = Animated.event(
    [{ nativeEvent: { position, offset } }],
    {
      useNativeDriver: true,
    },
  );

  const handleDelete = useCallback(
    (user: User) => {
      Alert.alert(
        'Delete User',
        `Are you sure you want to delete ${user.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteUser(user.id);
                setSkip(0);
                await getUsers({ searchTerm: search, limit: 15, offset: 0 });
              } catch (e) {
                console.error('Failed to delete user:', e);
              }
            },
          },
        ],
      );
    },
    [deleteUser, search, getUsers],
  );

  const handlePressItem = useCallback(
    (user: User) => {
      navigation.navigate('AddUserScreen', { mode: 'edit', user });
    },
    [navigation],
  );

  const handleCreate = useCallback(() => {
    navigation.navigate('AddUserScreen', { mode: 'create' });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.tabsWrap}>
            <Tabs
              tabs={tabs}
              activeIndex={activeIndex}
              onTabPress={handleTabPress}
            />
          </View>
        </View>
        <View style={styles.searchRow}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name"
          />
        </View>
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
      </View>
      <AnimatedPagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={activeIndex}
        onPageSelected={handlePageSelected}
        onPageScroll={handlePageScroll}
      >
        <View key="0">
          <UserList
            ref={allListRef}
            users={allFiltered}
            loading={loading}
            refreshing={isrefreshing}
            onRefresh={handleRefresh}
            onEndReached={loadMore}
            loadingMore={loadingMore}
            onDelete={handleDelete}
            onPressItem={handlePressItem}
          />
        </View>
        <View key="1">
          <UserList
            ref={adminListRef}
            users={adminFiltered}
            loading={loading}
            refreshing={isrefreshing}
            onRefresh={handleRefresh}
            onEndReached={loadMore}
            loadingMore={loadingMore}
            onDelete={handleDelete}
            onPressItem={handlePressItem}
          />
        </View>
        <View key="2">
          <UserList
            ref={managerListRef}
            users={managerFiltered}
            loading={loading}
            refreshing={isrefreshing}
            onRefresh={handleRefresh}
            onEndReached={loadMore}
            loadingMore={loadingMore}
            onDelete={handleDelete}
            onPressItem={handlePressItem}
          />
        </View>
      </AnimatedPagerView>
      <AddButton onPress={handleCreate} style={styles.fab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tabsWrap: {
    flex: 1,
  },
  searchRow: {
    width: '100%',
    marginTop: 6,
    marginBottom: 8,
    paddingBottom: 6,
    paddingTop: 8,
  },
  pager: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
  },
});

export default UserListScreen;
