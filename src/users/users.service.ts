import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DrizzleDb } from '../drizzle/drizzle.module';
import { UserSelect, usersTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  
  constructor (@Inject('DRIZZLE_DB') private db: DrizzleDb) {}

  private mapRowToDto(row: UserSelect){
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      first_name: row.first_name,
      last_name: row.last_name,
      phone: row.phone,
      create_at: row.created_at,
      is_active: row.is_active ? 'y' : 'n'
    }
  }

  async create(dto: CreateUserDto) {
    const existing = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1);

    if (existing.length) throw new ConflictException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);

    await this.db.insert(usersTable).values({
      email: dto.email,
      password: hashed,
      first_name: dto.first_name,
      last_name: dto.last_name,
      phone: dto.phone
    });

    const row = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1);

    return this.mapRowToDto(row[0]);
  }

  async findAll() {
    
    const rows = await this.db
      .select()
      .from(usersTable)
    
    return rows.map((r) => this.mapRowToDto(r))
  }

  async findOne(id: number) {
    const rows = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!rows.length) throw new NotFoundException('User not found');

    return this.mapRowToDto(rows[0]);
  }

  async findOneByEmail(email: string) {

    const rows = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return this.mapRowToDto(rows[0]);
  }

  async update(id: number, dto: UpdateUserDto) {
    const rows = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!rows.length) throw new NotFoundException('User not found');

    const toSet: Partial<typeof usersTable.$inferInsert> = {};

    if (dto.email) toSet.email = dto.email;
    if (dto.password) {
      toSet.password = await bcrypt.hash(dto.password, 10);
    }
    if (dto.first_name) toSet.first_name = dto.first_name;
    if (dto.last_name) toSet.last_name = dto.last_name;
    if (dto.phone) toSet.phone = dto.phone;
    if (dto.is_active) toSet.is_active = dto.is_active === 'n';

    await this.db.update(usersTable).set(toSet).where(eq(usersTable.id, id));
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.db.delete(usersTable).where(eq(usersTable.id, id));
    return `User has been successfully deleted`;
  }
}
