import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AppInterceptor implements NestInterceptor {
	constructor(
		private readonly loggerService: LoggerService
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const data = context.getArgs()[0]

		this.loggerService.log(`Request: ${data.method} ${data.url}`, {
			request_name: data.url,
			session_id: data.sessionID.id,
			username: data.session.username,
			request_body: data.body,
			request_headers: data.headers
		})

		return next.handle();
	}
}

