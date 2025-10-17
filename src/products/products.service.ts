import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DrizzleDb } from 'src/drizzle/drizzle.module';
import { ProductSelect, productsTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductsService {
  
  constructor (@Inject('DRIZZLE_DB') private db: DrizzleDb) {}
  
    private mapRowToDto(row: ProductSelect){
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        compare_price: row.compare_price,
        cost: row.cost,
        sku: row.sku,
        barcode: row.barcode,
        // weight: row.weight,
        stock_quantity: row.stock_quantity,
        is_active: row.is_active,
        category_id: row.category_id,
        create_at: row.created_at,
        updated_at: row.updated_at
      }
    }
  
  async create(dto: CreateProductDto) {
    const existing = await this.db
          .select()
          .from(productsTable)
          .where(eq(productsTable.name, dto.name))
          .limit(1);
    
    if (existing.length) throw new ConflictException('Product already exists');
    
    await this.db.insert(productsTable).values({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      compare_price: dto.compare_price,
      cost: dto.cost,
      sku: dto.sku,
      barcode: dto.barcode,
      // weight: dto.weight,
      stock_quantity: dto.stock_quantity,
      is_active: dto.is_active,
      category_id: dto.category_id,
    })

    return `Product ${dto.name} added correctly`
  }

  async findAll() {
    const rows = await this.db
          .select()
          .from(productsTable)
        
    return rows.map((r) => this.mapRowToDto(r))
  }

  async findOne(id: number) {
    const rows = await this.db
          .select()
          .from(productsTable)
          .where(eq(productsTable.id, id))
          .limit(1);
    
        if (!rows.length) throw new NotFoundException('Product not found');
    
        return this.mapRowToDto(rows[0]);
  }

  async update(id: number, dto: UpdateProductDto) {
    const rows = await this.db
          .select()
          .from(productsTable)
          .where(eq(productsTable.id, id))
          .limit(1);
    
        if (!rows.length) throw new NotFoundException('User not found');
    
        const toSet: Partial<typeof productsTable.$inferInsert> = {};
    
        if (dto.name) toSet.name = dto.name;
        if (dto.description) toSet.description = dto.description;
        if (dto.price) toSet.price = dto.price;
        if (dto.compare_price) toSet.compare_price = dto.compare_price;
        if (dto.cost) toSet.cost = dto.cost;
        if (dto.sku) toSet.sku = dto.sku;
        if (dto.barcode) toSet.barcode = dto.barcode;
        // if (dto.weight) toSet.weight = dto.weight;
        if (dto.stock_quantity) toSet.stock_quantity = dto.stock_quantity;
        if (dto.is_active) toSet.is_active = dto.is_active;
        if (dto.category_id) toSet.category_id = dto.category_id;
    
        await this.db.update(productsTable).set(toSet).where(eq(productsTable.id, id));
        return this.findOne(id);
  }

  async remove(id: number) {
    await this.db.delete(productsTable).where(eq(productsTable.id, id));
    return `Product has been successfully deleted`;
  }
}
