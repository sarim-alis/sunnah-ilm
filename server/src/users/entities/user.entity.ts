import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Preference } from './preference.entity';
import type { UserRole } from '../roles';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl!: string | null;

  @OneToMany(() => Preference, (preference) => preference.user, {
    eager: true,
  })
  preferences!: Preference[];

  @Column({ type: 'varchar', default: 'light' })
  mode!: 'light' | 'dark';

  @Column({ type: 'varchar', default: 'user' })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
