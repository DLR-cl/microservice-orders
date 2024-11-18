import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePedidoDto { 
    @IsNotEmpty()
    @IsNumber()
    id_venta: number;

    @IsNotEmpty()
    @IsDate()
    fecha_creacion: Date;

}