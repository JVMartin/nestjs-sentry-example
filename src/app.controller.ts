import { Controller, Get, HttpException, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { SentryService } from './sentry/sentry.service';
import { sleep } from './utils';
import { v4 as uuidv4 } from 'uuid';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sentryService: SentryService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const reqId = uuidv4();
    const span1 = this.sentryService.startChild({
      description: `id ${reqId}`,
    });
    await sleep(5000);
    const span2 = this.sentryService.startChild({
      description: `id ${reqId}`,
    });
    await sleep(5000);
    span1.finish();
    span2.finish();

    return this.appService.getHello();
  }

  @Get('throw')
  throwError(): string {
    throw new HttpException({ message: 'Sample Error' }, 500);
  }
}
