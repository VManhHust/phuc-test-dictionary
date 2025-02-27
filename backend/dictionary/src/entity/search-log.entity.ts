import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Word } from './word.entity';

@Entity()
export class SearchLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Word, { onDelete: 'CASCADE' })
  word: Word;

  @Column('bigint', { default: 0 })
  count: number;

  @CreateDateColumn()
  last_searched: Date;
}