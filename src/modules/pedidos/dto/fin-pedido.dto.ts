import { IsDataURI, IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class FinalizarPedidoDto {
    
    @IsNotEmpty()
    @IsNumber()
    id_pedido: number;

    @IsNotEmpty()
    @IsDate()
    fecha_fin: Date;
}