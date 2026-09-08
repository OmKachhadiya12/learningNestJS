import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity.js";
import { OrderItemEntity } from "./order-item.entity.js";

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED'
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User,(user) => user.orders,{
        nullable: false,
        onDelete: 'CASCADE',
    })
    user: User

    @Column({
        type: 'numeric',
        precision: 12,
        scale: 2,
        default: 0,
    }) 
    totalAmount: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status: OrderStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => OrderItemEntity,(orderItem) => orderItem.order,{
        cascade: true,
    })
    items: OrderItemEntity[]
}
