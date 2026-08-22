import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hadith } from './hadith.entity';

@Entity('saved_hadith')
@Index(['userId', 'hadithId'], { unique: true })
export class SavedHadith {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  hadithId!: string;

  @ManyToOne(() => Hadith, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'hadithId' })
  hadith!: Hadith;

  @CreateDateColumn()
  createdAt!: Date;
}
