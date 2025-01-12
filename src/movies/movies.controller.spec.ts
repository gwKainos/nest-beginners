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
});
