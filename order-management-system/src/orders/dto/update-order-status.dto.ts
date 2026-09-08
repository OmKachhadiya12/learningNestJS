import { IsEnum } from "class-validator";
import { OrderStatus } from "../entities/order.entity.js";

export class UpdateOrderStatus {
    @IsEnum(OrderStatus)
    status: OrderStatus;
}