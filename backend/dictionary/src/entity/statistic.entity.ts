import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  attribute: string;

  @Column('bigint')
  count: number;

  @UpdateDateColumn()
  updated_at: Date;
}