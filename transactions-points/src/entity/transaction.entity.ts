import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length, IsInt } from 'class-validator';
import { TransactionInterface } from './transaction.interface';

@Entity({name: 'TRANSACTION'})
export class Transaction implements TransactionInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsInt()
  points: number;

  @Column()
  status: number;

  @Column()
  @Length(32)
  user_id: string;
}