import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreationModule } from './creation/creation.module';

@Module({
  imports: [TypeOrmModule.forRoot(), CreationModule],
})
export class AppModule {}
