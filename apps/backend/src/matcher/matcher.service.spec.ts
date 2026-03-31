import { Test, TestingModule } from '@nestjs/testing';
import { MatcherService } from './matcher.service';

describe('MatcherService', () => {
  let service: MatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatcherService],
    }).compile();

    service = module.get<MatcherService>(MatcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
