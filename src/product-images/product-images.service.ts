import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { DrizzleDb } from 'src/drizzle/drizzle.module';
import { ProductImageSelect, productImagesTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductImagesService {
  
  constructor (@Inject('DRIZZLE_DB') private db: DrizzleDb) {}
  
    private mapRowToDto(row: ProductImageSelect){
      return {
        id: row.id,
        product_id: row.product_id,
        image_path: row.image_path,
        alt_text: row.alt_text,
        display_order: row.display_order,
        is_primary: row.is_primary,
      }
    }
  
  async create(dto: CreateProductImageDto) {
    const existing = await this.db
          .select()
          .from(productImagesTable)
          .where(eq(productImagesTable.image_path, dto.image_path))
          .limit(1);
    
    if (existing.length) throw new ConflictException('Image path already exists');

    await this.db.insert(productImagesTable).values({
          product_id: dto.product_id,
          image_path: dto.image_path,
          alt_text: dto.alt_text,
          display_order: dto.display_order,
          is_primary: dto.is_primary,
        });
    
    return `Image with path ${dto.image_path} save correctly`
  }

  async findAll() {
    const rows = await this.db
          .select()
          .from(productImagesTable)
        
    return rows.map((r) => this.mapRowToDto(r))
  }

  async findOne(id: number) {
    const rows = await this.db
          .select()
          .from(productImagesTable)
          .where(eq(productImagesTable.id, id))
          .limit(1);
    
        if (!rows.length) throw new NotFoundException('User not found');
    
        return this.mapRowToDto(rows[0]);
  }

  async update(id: number, dto: UpdateProductImageDto) {
    const rows = await this.db
          .select()
          .from(productImagesTable)
          .where(eq(productImagesTable.id, id))
          .limit(1);
    
    if (!rows.length) throw new NotFoundException('Product image not found');

    const toSet: Partial<typeof productImagesTable.$inferInsert> = {};
    
    if (dto.product_id) toSet.product_id = dto.product_id;
    if (dto.image_path) toSet.image_path = dto.image_path;
    if (dto.alt_text) toSet.alt_text = dto.alt_text;
    if (dto.display_order) toSet.display_order = dto.display_order;
    if (dto.is_primary) toSet.is_primary = dto.is_primary;

    await this.db.update(productImagesTable).set(toSet).where(eq(productImagesTable.id, id));
    return `Product image with id ${id} updated`
  }

  async remove(id: number) {
    await this.db.delete(productImagesTable).where(eq(productImagesTable.id, id));
    return `Product image has been successfully deleted`;
  }
}
