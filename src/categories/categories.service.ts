import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DrizzleDb } from 'src/drizzle/drizzle.module';
import { CategoriesSelect, categoriesTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CategoriesService {
  
  constructor (@Inject('DRIZZLE_DB') private db: DrizzleDb) {}
    
      private mapRowToDto(row: CategoriesSelect){
        return {
          id: row.id,
          name: row.name,
          description: row.description,
          image_path: row.image_path,
          parent_category_id: row.parent_category_id,
          created_at: row.created_at
        }
      }
  
  async create(dto: CreateCategoryDto) {
    const existing = await this.db
          .select()
          .from(categoriesTable)
          .where(eq(categoriesTable.name, dto.name))
          .limit(1);
    
        if (existing.length) throw new ConflictException('Category already exists');

    await this.db.insert(categoriesTable).values({
      name: dto.name,
      description: dto.description,
      image_path: dto.image_path
    });
    
    return `The category ${dto.name} was added successfully`
  }

  async findAll() {
    
    const rows = await this.db
      .select()
      .from(categoriesTable)
    
    return rows.map((r) => this.mapRowToDto(r));
  }

  async findOne(id: number) {
    const rows = await this.db
          .select()
          .from(categoriesTable)
          .where(eq(categoriesTable.id, id))
          .limit(1);
    
        if (!rows.length) throw new NotFoundException('Category not found');
    
        return this.mapRowToDto(rows[0]);
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const rows = await this.db
          .select()
          .from(categoriesTable)
          .where(eq(categoriesTable.id, id))
          .limit(1);
    
        if (!rows.length) throw new NotFoundException('Category not found');
    
        const toSet: Partial<typeof categoriesTable.$inferInsert> = {};
    
        if (dto.name) toSet.name = dto.name;
        if (dto.description) toSet.description = dto.description;
        if (dto.image_path) toSet.image_path = dto.image_path;
    
        await this.db.update(categoriesTable).set(toSet).where(eq(categoriesTable.id, id));
        return `The category ${dto.name} was updated successfully`
  }

  async remove(id: number) {
    await this.db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    return `Category has been successfully deleted`;
  }
}
