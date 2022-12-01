import { Test, TestingModule } from '@nestjs/testing';
import { SeedDataService } from './seed-data.service';

describe('SeedDataService', () => {
  let service: SeedDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeedDataService],
    }).compile();

    service = module.get<SeedDataService>(SeedDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
