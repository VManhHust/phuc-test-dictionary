import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Word } from './word.entity';

@Entity()
export class Definition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Word, (word) => word.definitions, { onDelete: 'CASCADE' })
  word: Word;

  @Column()
  dictionary_name: string;

  @Column()
  definition: string;

  @Column({ nullable: true })
  example: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}