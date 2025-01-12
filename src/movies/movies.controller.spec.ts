import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    genres: ['test'],
    year: 2000,
  };

  const mockMovies: Movie[] = [mockMovie];

  const mockMoviesService = {
    getAll: jest.fn().mockReturnValue(mockMovies),
    getOne: jest.fn().mockReturnValue(mockMovie),
    create: jest.fn().mockReturnValue(mockMovie),
    update: jest.fn().mockReturnValue(mockMovie),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a movie', () => {
      const createMovieDto: CreateMovieDto = {
        title: 'New Movie',
        genres: ['drama'],
        year: 2023,
      };

      expect(controller.create(createMovieDto)).toEqual(mockMovie);
      expect(service.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('getAll', () => {
    it('should return an array of movies', () => {
      expect(controller.getAll()).toEqual(mockMovies);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a movie', () => {
      expect(controller.getOne(1)).toEqual(mockMovie);
      expect(service.getOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should delete a movie and return void', () => {
      controller.remove(1);

      expect(service.deleteOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update and return a movie', () => {
      const updateMovieDto = {
        title: 'Updated Movie',
        genres: ['action'],
        year: 2024,
      };

      expect(controller.update(1, updateMovieDto)).toEqual(mockMovie);
      expect(service.update).toHaveBeenCalledWith(1, updateMovieDto);
    });
  });
});
