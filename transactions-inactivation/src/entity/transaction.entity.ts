import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert } from 'typeorm';
import { TransactionInterface } from './transaction.interface';

@Entity({name: 'TRANSACTION'})
export class Transaction implements TransactionInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: number;
}