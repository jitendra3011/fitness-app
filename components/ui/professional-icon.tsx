import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

type IconSymbolProps = {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

const ICON_MAPPING: Record<string, { lib: 'Material' | 'FontAwesome5' | 'Ionicon'; name: string }> = {
  home: { lib: 'Material', name: 'home' },
  flame: { lib: 'Ionicon', name: 'flame' },
  trophy: { lib: 'FontAwesome5', name: 'trophy' },
  profile: { lib: 'Ionicon', name: 'person-circle-outline' },
  'add-person': { lib: 'Material', name: 'person-add' },
  login: { lib: 'Material', name: 'login' },
  document: { lib: 'Ionicon', name: 'document-text-outline' },
  chart: { lib: 'Material', name: 'bar-chart' },
  video: { lib: 'Ionicon', name: 'videocam-outline' },
  blog: { lib: 'FontAwesome5', name: 'blog' },
  strength: { lib: 'Material', name: 'fitness-center' },
  send: { lib: 'Ionicon', name: 'send' },
  menu: { lib: 'Ionicon', name: 'menu' },
  privacy: { lib: 'Ionicon', name: 'lock-closed-outline' },
  diamond: { lib: 'FontAwesome5', name: 'gem' },
  run: { lib: 'Material', name: 'directions-run' },
};

export function IconSymbol({ name, size = 22, color = '#9CA3AF', style }: IconSymbolProps) {
  const icon = ICON_MAPPING[name];

  if (!icon) return <MaterialIcons name="help-outline" size={size} color={color} style={style} />;

  switch (icon.lib) {
    case 'Material':
      return <MaterialIcons name={icon.name} size={size} color={color} style={style} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={icon.name} size={size} color={color} style={style} />;
    case 'Ionicon':
      return <Ionicons name={icon.name} size={size} color={color} style={style} />;
    default:
      return <MaterialIcons name="help-outline" size={size} color={color} style={style} />;
  }
}