import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import winston from 'winston';

@Injectable()
export class LoggerService implements OnModuleInit {
	constructor(
		private readonly configService: ConfigService
	) {}

	private logger: winston.Logger;

	onModuleInit() {
		const elasticConfig = this.configService.get('elastic');
		const loggerConfig = this.configService.get('logger');

		const client = new Client({
			node: elasticConfig.hosts,
			auth: {
				password: elasticConfig.auth.password,
				username: elasticConfig.auth.username,
			},
		});

		const esTransportOpts = {
			level: loggerConfig.log,
			client: client,
			indexPrefix: elasticConfig.index,
			indexSuffixPattern:"YYYY.MM.DD"
		};

		const elasticOptions = new ElasticsearchTransport(esTransportOpts);

		const winstonLogger = winston.createLogger({
			transports: [elasticOptions],
			exitOnError: false,
			format: winston.format.json()
		});

		winstonLogger.on('error', (error: Error) => console.log('>error', error));
		this.logger = winstonLogger;
	}

	log(message: string, data: unknown) {
		this.logger.info(message, data)
	}

	error(message: string, data: unknown) {
		this.logger.error(message, data)
	}
}


