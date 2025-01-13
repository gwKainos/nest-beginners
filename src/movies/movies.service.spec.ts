import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('MoviesService', () => {
  let service: MoviesService;
  let prismaService: Partial<PrismaService>;

  const testMovieData: CreateMovieDto = {
    title: '이상한 나라의 수학자',
    year: 2022,
    genres: ['힐링', '감명을 주는', '청춘'],
  };

  const mockMovie = {
    id: 1,
    ...testMovieData,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMovieDelegate: Prisma.MovieDelegate<any> = {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    findFirst: jest.fn(),
    findFirstOrThrow: jest.fn(),
    create: jest.fn().mockResolvedValue(mockMovie),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    upsert: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
    fields: {
      id: undefined,
      title: undefined,
      genres: undefined,
      year: undefined,
      isDeleted: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
  };

  beforeEach(async () => {
    prismaService = {
      movie: mockMovieDelegate,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  describe('create', () => {
    it('should create a movie', async () => {
      jest.spyOn(prismaService.movie!, 'create').mockResolvedValue(mockMovie);

      const createdMovie = await service.create(testMovieData);

      expect(createdMovie).toMatchObject({
        id: 1,
        ...testMovieData,
      });

      expect(prismaService.movie!.create).toHaveBeenCalledWith({
        data: testMovieData,
      });
    });
  });

  describe('getAll', () => {
    it('should return an empty array if no movies exist', async () => {
      jest.spyOn(prismaService.movie!, 'findMany').mockResolvedValueOnce([]);

      const result = await service.getAll();
      expect(result).toEqual([]);
    });

    it('should return an array with all movies', async () => {
      jest
        .spyOn(prismaService.movie!, 'findMany')
        .mockResolvedValueOnce([mockMovie]);

      const result = await service.getAll();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(testMovieData);
    });
  });

  describe('getOne', () => {
    it('should return a movie by ID', async () => {
      jest
        .spyOn(prismaService.movie!, 'findUnique')
        .mockResolvedValueOnce(mockMovie);

      const movie = await service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toBe(1);
    });

    it('should throw a NotFoundException if movie not found', async () => {
      jest
        .spyOn(prismaService.movie!, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.getOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteOne', () => {
    it('should delete a movie by ID', async () => {
      jest
        .spyOn(prismaService.movie!, 'findUnique')
        .mockResolvedValueOnce(mockMovie);
      jest.spyOn(prismaService.movie!, 'update').mockResolvedValueOnce({
        ...mockMovie,
        isDeleted: true,
      });

      await service.deleteOne(1);

      expect(prismaService.movie!.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isDeleted: true },
      });
    });

    it('should throw a NotFoundException if movie not found', async () => {
      jest
        .spyOn(prismaService.movie!, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.deleteOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a movie by ID', async () => {
      jest
        .spyOn(prismaService.movie!, 'findUnique')
        .mockResolvedValueOnce(mockMovie);
      jest.spyOn(prismaService.movie!, 'update').mockResolvedValueOnce({
        ...mockMovie,
        title: 'Updated Test Movie',
      });

      const updatedMovie = await service.update(1, {
        title: 'Updated Test Movie',
      });

      expect(updatedMovie.title).toBe('Updated Test Movie');
      expect(prismaService.movie!.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'Updated Test Movie' },
      });
    });

    it('should throw a NotFoundException if movie not found', async () => {
      jest
        .spyOn(prismaService.movie!, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });
});
