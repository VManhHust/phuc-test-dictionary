import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne} from 'typeorm';
import { PostEntity } from './post.entity';
import {Role} from "./role.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  enabled: boolean;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'SET NULL' })
  role: Role;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];
}