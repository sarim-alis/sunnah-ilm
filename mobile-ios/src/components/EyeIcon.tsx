import { Image } from 'react-native';

type EyeIconProps = {
  size?: number;
  color: string;
};

export function EyeIcon({ size = 18, color }: EyeIconProps) {
  return (
    <Image
      source={require('../../public/eye.png')}
      tintColor={color}
      style={{ height: size, width: size }}
      resizeMode="contain"
      accessibilityLabel="View"
    />
  );
}
