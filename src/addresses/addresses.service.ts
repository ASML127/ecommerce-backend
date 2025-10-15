import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { DrizzleDb } from 'src/drizzle/drizzle.module';
import { AddressesSelect, addressesTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AddressesService {

  constructor (@Inject('DRIZZLE_DB') private db: DrizzleDb) {}
  
    private mapRowToDto(row: AddressesSelect){
      return {
        id: row.id,
        user_id: row.user_id,
        address_line1: row.address_line1,
        address_line2: row.address_line2,
        city: row.city,
        state: row.state,
        postal_code: row.postal_code,
        country: row.country,
        is_default: row.is_default,
        created_at: row.created_at
      }
    }

  async create(dto: CreateAddressDto) {

    await this.db.insert(addressesTable).values({
      user_id: dto.user_id,
      address_line1: dto.address_line1,
      address_line2: dto.address_line2,
      city: dto.city,
      state: dto.state,
      postal_code: dto.postal_code,
      country: dto.country,
      is_default: dto.is_default
    })

    return 'Address saved successfully'
  }

  async findAll() {
    
    const rows = await this.db
          .select()
          .from(addressesTable)
        
    return rows.map((r) => this.mapRowToDto(r))

  }

  async findOne(id: number) {
    const rows = await this.db
          .select()
          .from(addressesTable)
          .where(eq(addressesTable.id, id))
          .limit(1);
    
        if (!rows.length) throw new NotFoundException('Address not found');
    
    return this.mapRowToDto(rows[0]);
  }

  async update(id: number, dto: UpdateAddressDto) {
    const rows = await this.db
          .select()
          .from(addressesTable)
          .where(eq(addressesTable.id, id))
          .limit(1);
    
    if (!rows.length) throw new NotFoundException('Address not found');
    
    const toSet: Partial<typeof addressesTable.$inferInsert> = {};
    
    if (dto.address_line1) toSet.address_line1 = dto.address_line1;
    if (dto.address_line2) toSet.address_line2 = dto.address_line2;
    if (dto.city) toSet.city = dto.city;
    if (dto.state) toSet.state = dto.state;
    if (dto.postal_code) toSet.postal_code = dto.postal_code;
    if (dto.country) toSet.country = dto.country;
    if (dto.is_default) toSet.is_default = dto.is_default;

    await this.db.update(addressesTable).set(toSet).where(eq(addressesTable.id, id));
    return `The address has been updated successfully`;
  }

  async remove(id: number) {
    await this.db.delete(addressesTable).where(eq(addressesTable.id, id));
    return `Address has been successfully deleted`;
  }
}
