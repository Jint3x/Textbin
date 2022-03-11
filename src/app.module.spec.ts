import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('Tests EntryController', () => {
  let entryController: AppController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    entryController = moduleRef.get(AppController);
  });

  it('Assures that the correct response has been returned', () => {
    const response = entryController.data();

    expect(response).toBe('Hey there!');
  });
});
