import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PostEntity } from './post.entity';

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

  @Column()
  roles: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];
}