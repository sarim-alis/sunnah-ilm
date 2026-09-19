import { Image } from 'react-native';

type LogoutIconProps = {
  size?: number;
  color: string;
};

export function LogoutIcon({ size = 20, color }: LogoutIconProps) {
  return (
    <Image
      source={require('../../public/logout.png')}
      tintColor={color}
      style={{ height: size, width: size }}
      resizeMode="contain"
      accessibilityLabel="Logout"
    />
  );
}
