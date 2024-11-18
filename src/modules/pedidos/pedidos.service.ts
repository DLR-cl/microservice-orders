import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { DatabaseService } from 'src/database/database.service';
import { EstadoResponseDto } from './dto/estado-response.dto';

@Injectable()
export class PedidosService {

    constructor(
        private readonly _databaseService: DatabaseService,
    ){}

    public async generatePedido(pedido: CreatePedidoDto){
        try {
            const crear_pedido = await this._databaseService.pedido.create({
                data: pedido,
            });

            return crear_pedido;

        }catch(error){
            if(error instanceof BadRequestException){
                throw error;
            }
        }
    }

    public async verEstado(id_venta: number): Promise<EstadoResponseDto>{
        try {
            const estado: EstadoResponseDto = await this._databaseService.pedido.findUnique({
                where: {
                    id_venta: id_venta,
                },
                select: {
                    estado: true,
                    fecha_creacion: true,
                }
            });

            return estado;

        }catch(error){
            if(error instanceof BadRequestException){
                throw error;
            }
        }
    }

    public async finalizarPedido(id_pedido: number, fecha_fin: Date){
        try {
            if(!await this.existePedido(id_pedido)){
                throw new BadRequestException('No existe pedido');
            }

            const pedido = await this._databaseService.pedido.update({
                where:{
                    id_pedido: id_pedido,
                },
                data: {
                    fecha_fin: fecha_fin,
                }
            });

            return pedido;

        } catch (error) {
            
        }
    };

    public async existePedido(id_pedido: number){
        const pedido = await this._databaseService.pedido.findUnique({
            where: {
                id_pedido: id_pedido,
            }
        });

        if(!pedido){
            return false;
        }
        return true;
    }

    public async getAllPedidos(){
        const pedidos = await this._databaseService.pedido.findMany();
        return pedidos;
    }

    public async getPedido(id_pedido: number){
        try {
            if(!await this.existePedido(id_pedido)){
                throw new BadRequestException('No existe el pedido solicitado');
            }

            const pedido = await this._databaseService.pedido.findUnique({
                where: {
                    id_pedido: id_pedido
                }
            });

            return pedido;
        } catch (error) {
            if(error instanceof BadRequestException){
                throw error;
            }

            throw new InternalServerErrorException('Error interno del servidor al obtener pedido');
        }
    }
}
