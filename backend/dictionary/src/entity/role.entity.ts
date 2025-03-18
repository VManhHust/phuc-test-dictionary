// import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
// import {User} from "./user.entity";
// import {Permission} from "./permission.entity";
//
// @Entity()
// export class Role {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;
//
//     @Column({ unique: true })
//     name: string;
//
//     @OneToMany(() => User, (user) => user.role)
//     users: User[];
//
//     @OneToMany(() => Permission, (permission) => permission.role)
//     permissions: Permission[];
//
// }