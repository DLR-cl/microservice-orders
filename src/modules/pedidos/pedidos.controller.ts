import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { FinalizarPedidoDto } from './dto/fin-pedido.dto';

@Controller('pedidos')
export class PedidosController {
    constructor(
        private readonly _pedidosService: PedidosService,
    ){}
    @Post('generar')
    public async generarPedido(@Body() pedido: CreatePedidoDto){
        return await this._pedidosService.generatePedido(pedido);
    }

    @Get()
    public async getAllPedidos(){
        return await this._pedidosService.getAllPedidos();
    }

    @Get('estado/:id')
    public async getEstadoPedido(@Param('id') id_pedido: string){
        return await this._pedidosService.verEstado(+id_pedido);
    }
    
    @Get(':id')
    public async getPedido(@Param('id') id_pedido: string){
        return await this._pedidosService.getPedido(+id_pedido);
    }

    @Patch('finalizar-pedido')
    public async finalizarPedido(@Body() pedido: FinalizarPedidoDto){
        return await this._pedidosService.finalizarPedido(pedido.id_pedido, pedido.fecha_fin)
    }
}
