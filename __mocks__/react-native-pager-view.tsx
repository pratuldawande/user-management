import React from 'react';
import {View} from 'react-native';

export default function PagerViewMock(
  props: React.ComponentProps<typeof View>,
) {
  return <View {...props} />;
}
