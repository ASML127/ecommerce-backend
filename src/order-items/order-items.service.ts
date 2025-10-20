import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { DrizzleDb } from 'src/drizzle/drizzle.module';
import { OrderItemSelect, orderItemsTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class OrderItemsService {
  
  constructor (@Inject('DRIZZLE_DB') private db: DrizzleDb) {}
  
    private mapRowToDto(row: OrderItemSelect){
      return {
        id: row.id,
        order_id: row.order_id,
        product_id: row.product_id,
        product_name: row.product_name,
        product_price: row.product_price,
        quantity: row.quantity,
        total_price: row.total_price,
      }
    }
  
  async create(dto: CreateOrderItemDto) {
    const existing = await this.db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.order_id, dto.order_id))
      .limit(1);

    if (existing.length) throw new ConflictException('Order already exists');

    await this.db.insert(orderItemsTable).values({
      order_id: dto.order_id,
      product_id: dto.product_id,
      product_name: dto.product_name,
      product_price: dto.product_price,
      quantity: dto.quantity,
      total_price: dto.total_price,
    })
    
    return 'Order created successfully';
  }

  async findAll() {
    const rows = await this.db
      .select()
      .from(orderItemsTable)
    
    return rows.map((r) => this.mapRowToDto(r))
  }

  async findOne(id: number) {
    const rows = await this.db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.id, id))
      .limit(1);

    if (!rows.length) throw new NotFoundException('Order not found');

    return this.mapRowToDto(rows[0]);
  }

  async update(id: number, dto: UpdateOrderItemDto) {
    
    const rows = await this.db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.id, id))
      .limit(1);

    if (!rows.length) throw new NotFoundException('User not found');

    const toSet: Partial<typeof orderItemsTable.$inferInsert> = {};

     if (dto.order_id) toSet.order_id = dto.order_id;
     if (dto.product_id) toSet.product_id = dto.product_id;
     if (dto.product_name) toSet.product_name = dto.product_name;
     if (dto.product_price) toSet.product_price = dto.product_price;
     if (dto.quantity) toSet.quantity = dto.quantity;
     if (dto.total_price) toSet.total_price = dto.total_price;
    
    return `Order updated successfully`;
  }

  async remove(id: number) {
    await this.db.delete(orderItemsTable).where(eq(orderItemsTable.id, id));
    return `Order has been successfully deleted`;
  }
}
