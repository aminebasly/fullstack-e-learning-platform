import { TestBed } from '@angular/core/testing';

import { LevelAccessGuard } from './level-access.guard';

describe('LevelAccessGuard', () => {
  let guard: LevelAccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LevelAccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
