import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { ClubSocioService } from './club-socio.service';
import { SocioDto } from 'src/socio/socio.dto';
import { SocioEntity } from 'src/socio/socio.entity';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {

    constructor(private readonly clubSocioService: ClubSocioService){}

    @Post(':clubId/members/:socioId')
    async addMemberToClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
        return await this.clubSocioService.addMemberToClub(clubId, socioId);
    }

    @Get(':clubId/members/:socioId')
   async findMemberFromClub(@Param('clubId') culturaId: string, @Param('socioId') restauranteId: string){
       return await this.clubSocioService.findMemberFromClub(culturaId, restauranteId);
   }

   @Get(':clubId/members')
   async findMembersFromClub(@Param('clubId') clubId: string){
       return await this.clubSocioService.findMembersFromClub(clubId);
   }

   @Put(':clubId/members')
   async updateMembersFromClub(@Body() sociosDto: SocioDto[], @Param('clubId') clubId: string){
       const socios = plainToInstance(SocioEntity, sociosDto)
       return await this.clubSocioService.updateMembersFromClub(clubId, socios);
   }

   @Delete(':clubId/members/:socioId')
    @HttpCode(204)
   async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
       return await this.clubSocioService.deleteMemberFromClub(clubId, socioId);
   }

}
