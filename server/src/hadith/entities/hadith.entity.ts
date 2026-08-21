import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type HadithTranslation = {
  english: string;
  urdu: string;
  arabic: string;
};

export type HadithReference = {
  book: number;
  hadith: number;
};

@Entity('hadith')
@Index(['book', 'hadithNumber'], { unique: true })
@Index(['topic'])
export class Hadith {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  book!: string;

  @Column({ type: 'int' })
  hadithNumber!: number;

  @Column({ type: 'int' })
  arabicNumber!: number;

  @Column({ type: 'jsonb' })
  translation!: HadithTranslation;

  @Column()
  narrator!: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  grade!: string[];

  @Column({ type: 'varchar', default: '' })
  topic!: string;

  @Column({ type: 'varchar', default: '' })
  chapter!: string;

  @Column({ type: 'jsonb' })
  reference!: HadithReference;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'text', default: '' })
  description!: string;
}
