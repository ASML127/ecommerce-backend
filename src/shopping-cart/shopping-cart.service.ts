import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';
import { DrizzleDb } from 'src/drizzle/drizzle.module';
import { ShoppingCartSelect, shoppingCartsTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ShoppingCartService {
  
  constructor (@Inject('DRIZZLE_DB') private db: DrizzleDb) {}
  
    private mapRowToDto(row: ShoppingCartSelect){
      return {
        id: row.id,
        user_id: row.user_id,
      }
    }
  
  async create(dto: CreateShoppingCartDto) {

    const existing = await this.db
        .select()
        .from(shoppingCartsTable)
        .where(eq(shoppingCartsTable.user_id, dto.user_id))
        .limit(1);
    
    if (existing.length) throw new ConflictException('User id already exists');

    await this.db.insert(shoppingCartsTable).values({
      user_id: dto.user_id,
    })
    
    return 'Save';
  }

  async findAll() {
    const rows = await this.db
        .select()
        .from(shoppingCartsTable)
        
    return rows.map((r) => this.mapRowToDto(r))
  }

  async findOne(id: number) {
    const rows = await this.db
        .select()
        .from(shoppingCartsTable)
        .where(eq(shoppingCartsTable.id, id))
        .limit(1);
    
    if (!rows.length) throw new NotFoundException('Shopping cart not found');
    
    return this.mapRowToDto(rows[0]);
  }

  async update(id: number, dto: UpdateShoppingCartDto) {
    const rows = await this.db
        .select()
        .from(shoppingCartsTable)
        .where(eq(shoppingCartsTable.id, id))
        .limit(1);
  
    if (!rows.length) throw new NotFoundException('Shopping cart not found');

    const toSet: Partial<typeof shoppingCartsTable.$inferInsert> = {};

    if (dto.user_id) toSet.user_id = dto.user_id;

    await this.db.update(shoppingCartsTable).set(toSet).where(eq(shoppingCartsTable.id, id));
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.db.delete(shoppingCartsTable).where(eq(shoppingCartsTable.id, id));
    return `Shopping cart has been successfully deleted`;
  }
}
