import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { DrizzleDb } from 'src/drizzle/drizzle.module';
import { PaymentSelect, paymentsTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PaymentsService {
  
  constructor (@Inject('DRIZZLE_DB') private db: DrizzleDb) {}
  
    private mapRowToDto(row: PaymentSelect){
      return {
        id: row.id,
        order_id: row.order_id,
        payment_method: row.payment_method,
        payment_gateway_id: row.payment_gateway_id,
        amount: row.amount,
        currency: row.currency,
        status: row.status,
      }
    }
  
  async create(dto: CreatePaymentDto) {
    
    const existing = await this.db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.payment_method, dto.payment_method))
      .limit(1);

    if (existing.length) throw new ConflictException('Payment already exists');

    await this.db.insert(paymentsTable).values({
      order_id: dto.order_id,
      payment_method: dto.payment_method,
      payment_gateway_id: dto.payment_gateway_id,
      amount: dto.amount,
      currency: dto.currency,
      status: dto.status,
    })

    return `Payment (${dto.order_id} - ${dto.payment_method}) created successfully`;
  }

  async findAll() {
    const rows = await this.db
      .select()
      .from(paymentsTable)
    
    return rows.map((r) => this.mapRowToDto(r))
  }

  async findOne(id: number) {
    const rows = await this.db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.id, id))
      .limit(1);

    if (!rows.length) throw new NotFoundException('Payment not found');

    return this.mapRowToDto(rows[0]);
  }

  async update(id: number, dto: UpdatePaymentDto) {
    
    const rows = await this.db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.id, id))
      .limit(1);

    if (!rows.length) throw new NotFoundException('Payment not found');

    const toSet: Partial<typeof paymentsTable.$inferInsert> = {};

    if (dto.order_id) toSet.order_id = dto.order_id;
    if (dto.payment_method) toSet.payment_method = dto.payment_method;
    if (dto.payment_gateway_id) toSet.payment_gateway_id = dto.payment_gateway_id;
    if (dto.amount) toSet.amount = dto.amount;
    if (dto.currency) toSet.currency = dto.currency;
    if (dto.status) toSet.status = dto.status;

    return `Payment updated successfully`;
  }

  async remove(id: number) {
    await this.db.delete(paymentsTable).where(eq(paymentsTable.id, id));
    return `User has been successfully deleted`;
  }
}
