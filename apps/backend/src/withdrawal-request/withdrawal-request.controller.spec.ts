import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalRequestController } from './withdrawal-request.controller';
import { WithdrawalRequestService } from './withdrawal-request.service';

describe('WithdrawalRequestController', () => {
  let controller: WithdrawalRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WithdrawalRequestController],
      providers: [WithdrawalRequestService],
    }).compile();

    controller = module.get<WithdrawalRequestController>(WithdrawalRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
