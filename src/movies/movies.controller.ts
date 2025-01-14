import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  async getAll(): Promise<Movie[]> {
    return this.moviesService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Movie> {
    return this.moviesService.getOne(id);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number): Promise<void> {
    await this.moviesService.deleteOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return this.moviesService.update(id, updateMovieDto);
  }
}
