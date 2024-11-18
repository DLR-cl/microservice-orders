import { Estado } from "@prisma/client";

export class EstadoResponseDto {

    estado: Estado;
    fecha_creacion: Date;
}