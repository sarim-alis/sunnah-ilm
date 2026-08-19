import { Image } from 'react-native';

type PencilIconProps = {
  size?: number;
};

export function PencilIcon({ size = 28 }: PencilIconProps) {
  return (
    <Image
      source={require('../../assets/pencil.png')}
      style={{ height: size, width: size }}
      resizeMode="contain"
      accessibilityLabel="Edit"
    />
  );
}
