import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  const dataSource = {
    createEntityManager: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DataSource,
          useValue: dataSource
        }
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });
});
