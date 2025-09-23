import { Text } from 'react-native';
import { type StyleProp, type TextStyle } from 'react-native';

const EMOJI_MAPPING: Record<string, string> = {
  'house.fill': '🏠',
  'flame.fill': '🔥',
  'trophy.fill': '🏆',
  'person.crop.circle': '👤',
  'person.crop.circle.badge.plus': '👤+',
  'arrow.right.square.fill': '🔑',
  'doc.text': '📄',
  'doc.plaintext': '📋',
  'figure.strengthtraining.traditional': '💪',
  'paperplane.fill': '✈️',
  'line.3.horizontal': '☰',
  'goldAward': '🥇',
  'silverAward': '🥈',
  'bronzeAward': '🥉',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  const emoji = EMOJI_MAPPING[name] || '•';
  return (
    <Text style={[{ fontSize: size, color }, style]}>
      {emoji}
    </Text>
  );
}