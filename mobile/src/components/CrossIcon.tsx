import { Image } from 'react-native';

type CrossIconProps = {
  size?: number;
};

export function CrossIcon({ size = 18 }: CrossIconProps) {
  return (
    <Image
      source={require('../../public/cross.png')}
      style={{ height: size, width: size }}
      resizeMode="contain"
      accessibilityLabel="Delete"
    />
  );
}
