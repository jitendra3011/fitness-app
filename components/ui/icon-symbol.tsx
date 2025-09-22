// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'person.crop.circle': 'person',
  'line.3.horizontal': 'menu',
  'flame.fill': 'whatshot',   // 🔥 fire icon
  'trophy.fill': 'emoji-events', // 🏆 trophy icon
  'person.crop.circle.badge.plus' : 'person-add', // ➕ person with plus icon
  'arrow.right.square.fill': 'login', // 🔑 login icon
  'figure.run': 'directions-run',
  'arrow.left.arrow.right': 'swap-horiz',
  'figure.jumprope': 'fitness-center',
  'figure.highintensity.intervaltraining': 'trending-up',
  'figure.run.circle': 'track-changes',
  'figure.core.training': 'accessibility',
  'play.rectangle.fill': 'play-arrow',
  'camera.fill': 'camera-alt',
  'video.fill': 'videocam',
  'shield.fill': 'security',
  'play.circle.fill': 'play-circle-filled',
  'play.fill': 'play-arrow',
  'checkmark.circle.fill': 'check-circle',
  
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name as keyof typeof MAPPING] || 'help'} style={style} />;
}
