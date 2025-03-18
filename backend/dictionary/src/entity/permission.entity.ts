// import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
// import {Role} from "./role.entity";
//
// @Entity()
// export class Permission {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;
//
//     @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
//     role: Role;
//
//     @Column({ default: false })
//     is_create: boolean;
//
//     @Column({ default: false })
//     is_find: boolean;
//
//     @Column({ default: false })
//     is_update: boolean;
//
//     @Column({ default: false })
//     is_delete: boolean;
//
// }