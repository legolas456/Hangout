import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly logger: Logger) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// Before Request reaches controller
		const req = context.switchToHttp().getRequest();
		this.logger.log(
			`(Request) body: ${JSON.stringify(req.body)}, user: ${JSON.stringify(
				req.user,
			)}, session: ${JSON.stringify(req.session)}`,
			`${req.method} ${req.path}`,
		);

		// Before Response sent to client
		return next.handle().pipe(
			tap((data) => {
				const { statusCode } = context.switchToHttp().getResponse();
				this.logger.log(
					`(Response) ${JSON.stringify({ statusCode, error: data?.error })}`,
					`${req.method} ${req.path}`,
				);
			}),
		);
	}
}
