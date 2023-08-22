import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { type NestApplication, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './modules/app/app.module';
import cookieParser from 'cookie-parser';
import Session from 'express-session';
const RiakStore = require('express-riak')(Session);

async function backend(): Promise<void> {
	const app = await NestFactory.create<NestApplication>(AppModule, {
		cors: true,
	});
	const configService = app.get(ConfigService);
	const configRiak = configService.get('riak');
	const globalPrefix = '/api/v1';
	const port = process.env.PORT || 80;
	const validationPipe = new ValidationPipe();
	const riakOptions = {
		host: configRiak.host,
		port: configRiak.port
	};
	const riakStore = new RiakStore({
		bucket: configRiak.bucket,
		connection: riakOptions,
	});
	const sessionOptions = {
		secret: configRiak.secret,
		store: riakStore,
		proxy: true,
		resave: true,
		saveUninitialized: true,
	};
	const corsOptions = {
		origin: true,
		methods: 'GET, POST',
		credentials: true,
	};
	const session = Session(sessionOptions);

	app.use(session);
	app.useGlobalPipes(validationPipe);
	app.setGlobalPrefix(globalPrefix);
	app.use(cookieParser());
	app.enableCors(corsOptions);

  	await app.listen(port);
}

(async (): Promise<void> => {
	try {
		await backend();
		NestLogger.log('Application started');
	} catch (error) {
		NestLogger.error('Application failed', error);
	}
})();
