import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Function {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    function_name: string;
}