import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { FinalizarPedidoDto } from './dto/fin-pedido.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('pedidos')
export class PedidosController {
    constructor(
        private readonly _pedidosService: PedidosService,
    ){}
    @MessagePattern({cmd: 'crear_pedido'})
    public async generarPedido(@Payload() pedido: CreatePedidoDto){
        return await this._pedidosService.generatePedido(pedido);
    }

    @MessagePattern({cmd: 'find_all'})
    public async getAllPedidos(){
        return await this._pedidosService.getAllPedidos();
    }

    @MessagePattern({cmd: 'get_estado'})
    public async getEstadoPedido(@Payload('id', ParseIntPipe) id_pedido: number){
        return await this._pedidosService.verEstado(id_pedido);
    }
    
    @MessagePattern({cmd: 'get_pedido'})
    public async getPedido(@Payload('id', ParseIntPipe) id_pedido: number){
        return await this._pedidosService.getPedido(id_pedido);
    }

    @MessagePattern({cmd: 'finalizar_pedido'})
    public async finalizarPedido(@Payload() pedido: FinalizarPedidoDto){
        return await this._pedidosService.finalizarPedido(pedido.id_pedido, pedido.fecha_fin)
    }
}
