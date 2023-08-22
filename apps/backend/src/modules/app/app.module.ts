import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppInterceptor } from './app.interceptor';
import { ActivateModule } from '../activate/activate.module';
import { OrderModule } from '../order/order.module';
import { BalanceModule } from '../balance/balance.module';
import { ConfirmModule } from '../confirm/confirm.module';
import { PayModule } from '../pay/pay.module';
import { PurchaseModule } from '../purchase/purchase.module';
import { LoggerModule } from '../logger/logger.module';
import { SettingsModule } from '../settings/settings.module';
import config from '../../config.json';

const Interceptor = {
	provide: APP_INTERCEPTOR,
	useClass: AppInterceptor,
}

@Module({
  	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [() => config]
		}),
		LoggerModule,
		SettingsModule,
		ActivateModule,
		OrderModule,
		BalanceModule,
		PayModule,
		ConfirmModule,
		PurchaseModule
	],
  	controllers: [],
  	providers: [Interceptor],
})
export class AppModule {}
