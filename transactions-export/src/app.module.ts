import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportModule } from './export/export.module';

@Module({
  imports: [TypeOrmModule.forRoot(), ExportModule],
})
export class AppModule {}
