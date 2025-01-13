import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const testMovieData: CreateMovieDto = {
    title: '이상한 나라의 수학자',
    year: 2022,
    genres: ['힐링', '감명을 주는', '청춘'],
  };

  const mockMovie: Movie = {
    id: 1,
    title: '이상한 나라의 수학자',
    year: 2022,
    genres: ['힐링', '감명을 주는', '청춘'],
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMovies: Movie[] = [mockMovie];

  const mockMoviesService = {
    create: jest.fn().mockReturnValue(mockMovie),
    getAll: jest.fn().mockReturnValue(mockMovies),
    getOne: jest.fn().mockReturnValue(mockMovie),
    deleteOne: jest.fn().mockReturnValue(mockMovie),
    // update: jest.fn().mockReturnValue(mockMovie),
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
    it('should create and return a movie', async () => {
      const result = await controller.create(testMovieData);

      expect(result).toEqual(mockMovie);
      expect(service.create).toHaveBeenCalledWith(testMovieData);
    });
  });

  describe('getAll', () => {
    it('should return an array of movies', async () => {
      const result = await controller.getAll();

      expect(result).toEqual(mockMovies);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a movie', async () => {
      const result = await controller.getOne(1);

      expect(result).toEqual(mockMovie);
      expect(service.getOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should delete a movie and return void', () => {
      controller.deleteOne(1);

      expect(service.deleteOne).toHaveBeenCalledWith(1);
    });
  });

  // describe('update', () => {
  //   it('should update and return a movie', () => {
  //     const updateMovieDto = {
  //       title: 'Updated Movie',
  //       genres: ['action'],
  //       year: 2024,
  //     };
  //
  //     expect(controller.update(1, updateMovieDto)).toEqual(mockMovie);
  //     expect(service.update).toHaveBeenCalledWith(1, updateMovieDto);
  //   });
  // });
});
