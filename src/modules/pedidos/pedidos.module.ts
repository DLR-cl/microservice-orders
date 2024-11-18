import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [PedidosService],
  controllers: [PedidosController],
  imports: [DatabaseModule]
})
export class PedidosModule {}
