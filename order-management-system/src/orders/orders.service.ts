import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity.js';
import { Repository } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { User } from '../users/entities/user.entity.js';
import { DataSource } from 'typeorm/browser';
import { UpdateOrderStatus } from './dto/update-order-status.dto.js';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order) 
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemsRepoitory: Repository<OrderItemEntity>,
    @InjectRepository(Product) 
    private readonly productsRepoitory: Repository<Product>,
    @InjectRepository(User) 
    private readonly usersRepoitory: Repository<User>,
    private readonly datasource: DataSource
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.datasource.transaction(async (manager) => {

      const user = await manager.findOne(User,{
        where: {
          id: createOrderDto.userId
        }
      })

      if(!user){
        throw new NotFoundException('User not Found.')
      }

      const orderItems: OrderItemEntity[] = [];
      let totalAmount = 0;

      for(const itemDto of createOrderDto.items) {
        const product = await manager.findOne(Product,{
          where: {
            id: itemDto.productId
          }
        })

        if(!product) {
          throw new BadRequestException(`Product ${itemDto.productId} not found`)
        }

        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}`,
          );
        }

        const itemPrice = Number(product.price);

        totalAmount += itemPrice * itemDto.quantity;

        product.stock -= itemDto.quantity;

        await manager.save(Product, product);

        const orderItem = manager.create(OrderItemEntity, {
          product,
          quantity: itemDto.quantity,
          price: itemPrice,
        });

        orderItems.push(orderItem);
      }

      const order = manager.create(Order, {
        user,
        totalAmount,
        status: OrderStatus.PENDING,
        items: orderItems,
      });

      const savedOrder = await manager.save(Order, order);

      return manager.findOne(Order, {
          where: {
            id: savedOrder.id,
          },
          relations: {
            user: true,
            items: {
              product: true,
            },
          },
        });
    }) 
  }

  findAll() {
    return this.ordersRepository.find({
      relations: {
        user: true,
        items: {
          product: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        user: true,
        items: {
          product: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: number, dto: UpdateOrderStatus) {
    const order = await this.findOne(id);

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException(
        'Cancelled order cannot be updated',
      );
    }

    order.status = dto.status;

    return this.ordersRepository.save(order);
  }

  async remove(id: number) {
    const order = await this.findOne(id);

    await this.ordersRepository.remove(order);

    return {
      message: 'Order deleted successfully',
    };
  }
}
