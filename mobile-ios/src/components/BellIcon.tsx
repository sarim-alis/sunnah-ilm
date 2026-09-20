import { Image } from 'react-native';

type BellIconProps = {
  size?: number;
  color: string;
};

export function BellIcon({ size = 20, color }: BellIconProps) {
  return (
    <Image
      source={require('../../public/bell.png')}
      tintColor={color}
      style={{ height: size, width: size }}
      resizeMode="contain"
      accessibilityLabel="Notifications"
    />
  );
}
