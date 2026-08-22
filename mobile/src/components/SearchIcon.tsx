import { Image } from 'react-native';

type SearchIconProps = {
  size?: number;
  color: string;
};

export function SearchIcon({ size = 20, color }: SearchIconProps) {
  return (
    <Image
      source={require('../../public/search.png')}
      tintColor={color}
      style={{ height: size, width: size }}
      resizeMode="contain"
      accessibilityLabel="Search"
    />
  );
}
