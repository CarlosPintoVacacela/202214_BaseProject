import { Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from './club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { ClubController } from './club.controller';

@Module({
  imports:[TypeOrmModule.forFeature([ClubEntity, SocioEntity])],
  providers: [ClubService],
  controllers: [ClubController]
})
export class ClubModule {}
