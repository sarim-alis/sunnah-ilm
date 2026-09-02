import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  Text,
  View,
} from 'react-native';
import { createStyles } from '@/styles/modals/AskLoadingModal';
import { useTheme } from '@/theme/ThemeProvider';

const STATUS_STEPS = [
  'Searching corpus...',
  'Finding relevant Ahadees...',
  'Curating narrations...',
  'Preparing your answer...',
] as const;

type AskLoadingModalProps = {
  visible: boolean;
};

export function AskLoadingModal({ visible }: AskLoadingModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [percent, setPercent] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const pulse = useRef(new Animated.Value(1)).current;
  const statusOpacity = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      setPercent(0);
      setStepIndex(0);
      progressWidth.setValue(0);
      return;
    }

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.start();

    const tick = setInterval(() => {
      setPercent((current) => {
        if (current >= 95) return current;
        const bump = current < 40 ? 4 : current < 70 ? 2.5 : 1.2;
        return Math.min(95, Math.round(current + bump));
      });
    }, 350);

    const stepTimer = setInterval(() => {
      setStepIndex((current) => {
        const next = Math.min(current + 1, STATUS_STEPS.length - 1);
        Animated.sequence([
          Animated.timing(statusOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(statusOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
        return next;
      });
    }, 1800);

    return () => {
      pulseLoop.stop();
      clearInterval(tick);
      clearInterval(stepTimer);
    };
  }, [visible, pulse, statusOpacity, progressWidth]);

  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: percent,
      duration: 280,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [percent, progressWidth]);

  const fillWidth = progressWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Animated.View style={[styles.iconWrap, { transform: [{ scale: pulse }] }]}>
            <Image
              source={require('../../public/hint.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </Animated.View>

          <Text style={styles.title}>Working on your answer</Text>

          <Animated.Text style={[styles.status, { opacity: statusOpacity }]}>
            {STATUS_STEPS[stepIndex]}
          </Animated.Text>

          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: fillWidth }]} />
          </View>

          <View style={styles.percentRow}>
            <Text style={styles.percent}>{percent}%</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
