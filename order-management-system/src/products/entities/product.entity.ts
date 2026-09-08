import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItemEntity } from "../../orders/entities/order-item.entity.js";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 150
    }) 
    name: string;

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2
    })
    price: number;

    @Column()
    stock: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => OrderItemEntity,(orderItem) => orderItem.product)
    orderItems: OrderItemEntity[]
}
