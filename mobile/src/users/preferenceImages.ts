import type { ImageSourcePropType } from 'react-native';
import type { HadithTopic } from './preferences';

export const PREFERENCE_IMAGES: Record<HadithTopic, ImageSourcePropType> = {
  Quran: require('../../public/preferences/quran.png'),
  Parents: require('../../public/preferences/parents.png'),
  Marriage: require('../../public/preferences/marriage.png'),
  Prayer: require('../../public/preferences/prayer.png'),
  Love: require('../../public/preferences/love.png'),
  Health: require('../../public/preferences/health.png'),
  Anger: require('../../public/preferences/anger.png'),
  Death: require('../../public/preferences/death.png'),
  Education: require('../../public/preferences/education.png'),
};

export function preferenceImage(name: string): ImageSourcePropType | undefined {
  return PREFERENCE_IMAGES[name as HadithTopic];
}
