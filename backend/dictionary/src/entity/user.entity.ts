import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index, OneToMany
} from 'typeorm';
import {PostEntity} from "./post.entity";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Index()
  @Column({ nullable: true })
  googleId: string;

  @Index()
  @Column({ nullable: true })
  facebookId: string;

  @Column({ default: 'USER' })
  roles: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];
}