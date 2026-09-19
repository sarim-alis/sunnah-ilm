import { Image } from 'react-native';

type PencilIconProps = {
  size?: number;
  color?: string;
};

export function PencilIcon({ size = 28, color }: PencilIconProps) {
  return (
    <Image
      source={require('../../public/pencil.png')}
      tintColor={color}
      style={{ height: size, width: size }}
      resizeMode="contain"
      accessibilityLabel="Edit"
    />
  );
}
