import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../user.types.js";

@Entity('users')
 export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fname: string;

    @Column()
    lname: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column({
        default: Role.Student
    })
    role: string;

    @Column({
        select: false
    })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}