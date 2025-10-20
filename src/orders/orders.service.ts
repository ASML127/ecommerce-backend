import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DrizzleDb } from 'src/drizzle/drizzle.module';
import { OrderSelect, ordersTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class OrdersService {
  
  constructor (@Inject('DRIZZLE_DB') private db: DrizzleDb) {}

  private mapRowToDto(row: OrderSelect) {
    return {
      id: row.id,
      order_number: row.order_number,
      user_id: row.user_id,
      status: row.status,
      total_amount: row.total_amount,
      subtotal: row.subtotal,
      tax_amount: row.tax_amount,
      shipping_amount: row.shipping_amount,
      shipping_address_id: row.shipping_address_id,
      payment_status: row.payment_status,
    }
  }
  
  async create(dto: CreateOrderDto) {
    const existing = await this.db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.order_number, dto.order_number))
      .limit(1);

    if (existing.length) throw new ConflictException('Order already exists');

    await this.db.insert(ordersTable).values({
      order_number: dto.order_number,
      user_id: dto.user_id,
      status: dto.status,
      total_amount: dto.total_amount,
      subtotal: dto.subtotal,
      tax_amount: dto.tax_amount,
      shipping_amount: dto.shipping_amount,
      shipping_address_id: dto.shipping_address_id,
      payment_status: dto.payment_status,
    })
    
    return `Order (${dto.order_number}) created successfully`;
  }

  async findAll() {
    const rows = await this.db
      .select()
      .from(ordersTable)
    
    return rows.map((r) => this.mapRowToDto(r))
  }

  async findOne(id: number) {
    const rows = await this.db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .limit(1);

    if (!rows.length) throw new NotFoundException('Order not found');

    return this.mapRowToDto(rows[0]);
  }

  async update(id: number, dto: UpdateOrderDto) {
    const rows = await this.db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .limit(1);

    if (!rows.length) throw new NotFoundException('Order not found');

    const toSet: Partial<typeof ordersTable.$inferInsert> = {};

    if (dto.order_number) toSet.order_number = dto.order_number;
    if (dto.user_id) toSet.user_id = dto.user_id;
    if (dto.status) toSet.status = dto.status;
    if (dto.total_amount) toSet.total_amount = dto.total_amount;
    if (dto.subtotal) toSet.subtotal = dto.subtotal;
    if (dto.tax_amount) toSet.tax_amount = dto.tax_amount;
    if (dto.shipping_amount) toSet.shipping_amount = dto.shipping_amount;
    if (dto.shipping_address_id) toSet.shipping_address_id = dto.shipping_address_id;
    if (dto.payment_status) toSet.payment_status = dto.payment_status;

    return `Order updated correctly`;
  }

  async remove(id: number) {
    await this.db.delete(ordersTable).where(eq(ordersTable.id, id));
    return `User has been successfully deleted`;
  }
}
