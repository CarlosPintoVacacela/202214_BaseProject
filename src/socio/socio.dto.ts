import {IsNotEmpty, IsString, IsDateString, Contains} from 'class-validator';

export class SocioDto {

    @IsString()
    @IsNotEmpty()
    readonly nombreUsuario: string;
    
    @IsString()
    @IsNotEmpty()
    @Contains('@')
    readonly correo: string;

    @IsString()
    @IsNotEmpty()
    @IsDateString()
    readonly fechaNacimiento: string;

   }