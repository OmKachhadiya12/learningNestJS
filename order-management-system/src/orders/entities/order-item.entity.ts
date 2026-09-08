import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity.js";
import { Product } from "../../products/entities/product.entity.js";

@Entity('order_items')
export class OrderItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order,(order) => order.items,{
        nullable: false,
        onDelete:'CASCADE'
    })
    order: Order

    @ManyToOne(() => Product,(product) => product.orderItems,{
        nullable: false
    })
    product: Product

    @Column({ type: 'int' })
    quantity: number;

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2,
    })
    price: number;
}
