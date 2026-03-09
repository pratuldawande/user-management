import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';

type TabValue = 'ALL' | 'ADMIN' | 'MANAGER';
export type TabItem = {
  key: TabValue;
  label: string;
};

type Props = {
  tabs: TabItem[];
  activeIndex: number;
  onTabPress: (index: number) => void;
};

const Tabs = ({ tabs, activeIndex, onTabPress }: Props) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  const tabWidth = containerWidth > 0 ? containerWidth / tabs.length : 0;

  const handlePress = useCallback(
    (index: number) => {
      if (index !== activeIndex) {
        onTabPress(index);
      }
    },
    [onTabPress, activeIndex],
  );

  useEffect(() => {
    if (!tabWidth) return;

    Animated.timing(translateX, {
      toValue: activeIndex * tabWidth,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, tabWidth, translateX]);

  return (
    <View
      style={[styles.container]}
      onLayout={event => setContainerWidth(event.nativeEvent.layout.width)}
    >
      <Animated.View
        style={[
          styles.slider,
          {
            width: tabWidth,
            transform: [{ translateX }],
          },
        ]}
      />

      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tab, { width: tabWidth }]}
          onPress={() => handlePress(index)}
        >
          <Text style={activeIndex === index ? styles.activeText : styles.text}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 40,
  },
  tab: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#EAF2FF',
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: '#2F6BFF',
  },
  text: {
    color: '#333333',
    fontSize: 16,
  },
  activeText: {
    color: '#2F6BFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Tabs;
