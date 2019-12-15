import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Controller()
export class AppController {
    private logger: Logger = new Logger();

    constructor(private readonly appService: AppService) {
    }

    @MessagePattern('upload')
    public uploadVideo(data: any): Observable<any> {
        this.logger.log(`Uploading video ${data.originalname}`);
        return this.appService.uploadVideo(data).pipe(
          map((res) => res),
          catchError((err) => err),
        );
    }
}
