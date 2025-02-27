import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Definition } from './definition.entity';
import { Etymology } from './etymology.entity';
import { Synonym } from './synonym.entity';

@Entity()
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  word: string;

  @Column({ nullable: true })
  pronunciation: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Definition, (definition) => definition.word)
  definitions: Definition[];

  @OneToMany(() => Etymology, (etymology) => etymology.word)
  etymologies: Etymology[];

  @OneToMany(() => Synonym, (synonym) => synonym.word)
  synonyms: Synonym[];
}