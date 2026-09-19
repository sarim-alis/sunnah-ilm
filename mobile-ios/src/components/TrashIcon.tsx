import { Image } from 'react-native';

type TrashIconProps = {
  size?: number;
  color: string;
};

export function TrashIcon({ size = 18, color }: TrashIconProps) {
  return (
    <Image
      source={require('../../public/trash.png')}
      tintColor={color}
      style={{ height: size, width: size }}
      resizeMode="contain"
      accessibilityLabel="Delete"
    />
  );
}
