import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { DatabaseService } from 'src/database/database.service';
import { EstadoResponseDto } from './dto/estado-response.dto';
import { RpcException } from '@nestjs/microservices';
import { stat } from 'fs';

@Injectable()
export class PedidosService {
    private readonly logger = new Logger('Orders Microservice')

    constructor(
        private readonly _databaseService: DatabaseService,
    ) {
        this.logger.log('conectado a la base de datos');
    }

    public async generatePedido(pedido: CreatePedidoDto) {
        try {
            const crear_pedido = await this._databaseService.pedido.create({
                data: pedido,
            });

            return crear_pedido;

        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            throw new RpcException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor al generar un pedido'
            })
        }
    }

    public async verEstado(id_venta: number): Promise<EstadoResponseDto> {
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

        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }
            throw new RpcException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor al ver estado del pedido',
            });
        }
    }

    public async finalizarPedido(id_pedido: number, fecha_fin: Date) {
        try {
            if (!await this.existePedido(id_pedido)) {
                throw new RpcException({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'No existe pedido'
                });
            }

            const pedido = await this._databaseService.pedido.update({
                where: {
                    id_pedido: id_pedido,
                },
                data: {
                    fecha_fin: fecha_fin,
                }
            });

            return pedido;

        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            throw new RpcException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor al finalizar el pedido'
            })
        }
    };

    public async existePedido(id_pedido: number) {
        const pedido = await this._databaseService.pedido.findUnique({
            where: {
                id_pedido: id_pedido,
            }
        });

        if (!pedido) {
            return false;
        }
        return true;
    }

    public async getAllPedidos() {
        const pedidos = await this._databaseService.pedido.findMany();
        return pedidos;
    }

    public async getPedido(id_pedido: number) {
        try {
            if (!await this.existePedido(id_pedido)) {
                throw new RpcException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        message: 'No existe el pedido solicitado'
                    }
                );
            }

            const pedido = await this._databaseService.pedido.findUnique({
                where: {
                    id_pedido: id_pedido
                }
            });

            return pedido;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            throw new RpcException({

                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor al obtener pedido'
            }
            );
        }
    }
}
