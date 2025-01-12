import { Module } from '@nestjs/common';
import { AppService } from './app/app.service';
import { AppController } from './app/app.controller';
import { MoviesController } from './movies/movies.controller';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [MoviesModule],
  controllers: [AppController, MoviesController],
  providers: [AppService],
})
export class AppModule {}
