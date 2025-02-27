import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Word } from './word.entity';

@Entity()
export class Etymology {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Word, (word) => word.etymologies, { onDelete: 'CASCADE' })
  word: Word;

  @Column()
  origin: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}