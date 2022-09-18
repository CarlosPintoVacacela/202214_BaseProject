import {IsNotEmpty, IsString, IsDateString, MaxLength, IsUrl} from 'class-validator';

export class ClubDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsString()
    @IsNotEmpty()
    @IsDateString()
    readonly fechaFundacion: string;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    readonly imagen: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    readonly descripcion: string;


   }