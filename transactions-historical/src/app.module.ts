import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricalModule } from './historical/historical.module';

@Module({
  imports: [TypeOrmModule.forRoot(), HistoricalModule],
})
export class AppModule {}
