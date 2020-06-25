import { Entity, Column, PrimaryColumn, CreateDateColumn, BeforeInsert } from 'typeorm';
import { createHash } from 'crypto';
import { hash } from 'bcrypt';
import { IsEmail, Min, Length } from 'class-validator';
import { UserInterface } from './user.interface';

@Entity({name: 'USER'})
export class User implements UserInterface {
  @PrimaryColumn()
  user_id: string;

  @CreateDateColumn()
  created_date: Date;

  @Column()
  @Length(1, 100)
  name: string;

  @Column()
  @Length(1, 100)
  lastName: string;

  @Column()
  birth_date: Date;

  @Column()
  @IsEmail()
  @Length(1, 100)
  email: string;

  @Column()
  @Min(5)
  password: string;

  @BeforeInsert()
  async idGenerator() {
    this.user_id = createHash('md5').update(this.email).digest('hex');
  }

  @BeforeInsert()
  async passwordHash() {
    this.password = await hash(this.password, 10);
  }
}