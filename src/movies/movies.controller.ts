import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() movieData: CreateMovieDto): Movie {
    return this.moviesService.create(movieData);
  }

  @Get()
  getAll(): Movie[] {
    return this.moviesService.getAll();
  }
}
