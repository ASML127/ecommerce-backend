import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { DrizzleDb } from 'src/drizzle/drizzle.module';
import { CartItemSelect, cartItemsTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CartItemsService {
  
  constructor (@Inject('DRIZZLE_DB') private db: DrizzleDb) {}
  
    private mapRowToDto(row: CartItemSelect){
      return {
        id: row.id,
        cart_id: row.cart_id,
        product_id: row.product_id,
        quantity: row.quantity,
        unit_price: row.unit_price,
      }
    }
  
  async create(dto: CreateCartItemDto) {
    const existing = await this.db
        .select()
        .from(cartItemsTable)
        .where(eq(cartItemsTable.cart_id, dto.cart_id))
        .limit(1);
    
    if (existing.length) throw new ConflictException('Cart already exists');

    await this.db.insert(cartItemsTable).values({
      cart_id: dto.cart_id,
      product_id: dto.product_id,
      quantity: dto.quantity,
      unit_price: dto.unit_price,
    })

    return `Items added to cart ${dto.cart_id}`
  }

  async findAll() {
    const rows = await this.db
        .select()
        .from(cartItemsTable)
        
    return rows.map((r) => this.mapRowToDto(r))
  }

  async findOne(id: number) {
    const rows = await this.db
      .select()
      .from(cartItemsTable)
      .where(eq(cartItemsTable.id, id))
      .limit(1);

    if (!rows.length) throw new NotFoundException('Cart not found');

    return this.mapRowToDto(rows[0]);
  }

  async update(id: number, dto: UpdateCartItemDto) {
    const rows = await this.db
      .select()
      .from(cartItemsTable)
      .where(eq(cartItemsTable.id, id))
      .limit(1);

    if (!rows.length) throw new NotFoundException('Cart not found');

    const toSet: Partial<typeof cartItemsTable.$inferInsert> = {};

    if (dto.cart_id) toSet.cart_id = dto.cart_id;
    if (dto.product_id) toSet.product_id = dto.product_id;
    if (dto.quantity) toSet.quantity = dto.quantity;
    if (dto.unit_price) toSet.unit_price = dto.unit_price;

    await this.db.update(cartItemsTable).set(toSet).where(eq(cartItemsTable.id, id));
    return `Cart has been successfully updated`;
  }

  async remove(id: number) {
    await this.db.delete(cartItemsTable).where(eq(cartItemsTable.id, id));
    return `Cart has been successfully deleted`;
  }
}
