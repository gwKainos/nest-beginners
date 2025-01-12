import { Module } from '@nestjs/common';
import { AppService } from './app/app.service';
import { AppController } from './app/app.controller';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [MoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
