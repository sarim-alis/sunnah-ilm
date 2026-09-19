import { Text, View, type StyleProp, type TextStyle } from 'react-native';

type MarkdownBoldTextProps = {
  children: string;
  style?: StyleProp<TextStyle>;
  paragraphGap?: number;
};

type LanguageLabel = 'ARABIC' | 'ENGLISH' | 'URDU';

type ExplanationBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'language'; label: LanguageLabel; text: string };

const LANGUAGE_PATTERN = /^(ARABIC|ENGLISH|URDU)$/i;

function renderBoldParts(text: string, style?: StyleProp<TextStyle>) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={index} style={[style, { fontWeight: '700' }]}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return part;
  });
}

export function formatLanguageSpacing(text: string): string {
  return text
    .replace(/\s*(?:\*\*)?Arabic\s*:?\s*(?:\*\*)?\s*/gi, '\n\nARABIC\n')
    .replace(/\s*(?:\*\*)?English\s*:?\s*(?:\*\*)?\s*/gi, '\n\nENGLISH\n')
    .replace(/\s*(?:\*\*)?Urdu\s*:?\s*(?:\*\*)?\s*/gi, '\n\nURDU\n')
    .replace(/^\n+/, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseExplanationBlocks(text: string): ExplanationBlock[] {
  const blocks: ExplanationBlock[] = [];
  const parts = formatLanguageSpacing(text).split(/\n\n+/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const inlineMatch = trimmed.match(/^(ARABIC|ENGLISH|URDU)\n([\s\S]+)$/i);
    if (inlineMatch) {
      blocks.push({
        kind: 'language',
        label: inlineMatch[1].toUpperCase() as LanguageLabel,
        text: inlineMatch[2].trim(),
      });
      continue;
    }

    if (LANGUAGE_PATTERN.test(trimmed)) {
      continue;
    }

    blocks.push({ kind: 'paragraph', text: trimmed });
  }

  return blocks;
}

export function MarkdownBoldText({
  children,
  style,
  paragraphGap = 12,
}: MarkdownBoldTextProps) {
  const blocks = parseExplanationBlocks(children);

  return (
    <View>
      {blocks.map((block, index) => {
        const spacing = index > 0 ? { marginTop: paragraphGap } : null;

        if (block.kind === 'language') {
          return (
            <View key={index} style={spacing}>
              <Text
                style={[
                  style,
                  {
                    fontWeight: '700',
                    letterSpacing: 0.4,
                    marginBottom: 4,
                    textTransform: 'uppercase',
                  },
                ]}
              >
                {block.label}
              </Text>
              <Text style={style}>{renderBoldParts(block.text, style)}</Text>
            </View>
          );
        }

        return (
          <Text key={index} style={[style, spacing]}>
            {renderBoldParts(block.text, style)}
          </Text>
        );
      })}
    </View>
  );
}
