import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            getAll: jest.fn(),
            getOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            deleteOne: jest.fn(),
          },
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

      const result: Movie = {
        id: 1,
        ...createMovieDto,
      };

      jest.spyOn(service, 'create').mockReturnValue(result);

      expect(controller.create(createMovieDto)).toEqual(result);
    });
  });

  describe('getAll', () => {
    it('should return an array of movies', () => {
      const result: Movie[] = [
        {
          id: 1,
          title: 'Test Movie',
          genres: ['test'],
          year: 2000,
        },
      ];
      jest.spyOn(service, 'getAll').mockReturnValue(result);

      expect(controller.getAll()).toEqual(result);
    });
  });

  describe('getOne', () => {
    it('should return a movie', () => {
      const result: Movie = {
        id: 1,
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      };

      jest.spyOn(service, 'getOne').mockReturnValue(result);

      expect(controller.getOne(1)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should delete a movie and return void', () => {
      jest.spyOn(service, 'deleteOne').mockReturnValue(undefined);
      controller.remove(1);

      expect(service.deleteOne).toHaveBeenCalled();
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

      const result: Movie = {
        id: 1,
        ...updateMovieDto,
      };

      jest.spyOn(service, 'update').mockReturnValue(result);

      expect(controller.update(1, updateMovieDto)).toEqual(result);
    });
  });
});
