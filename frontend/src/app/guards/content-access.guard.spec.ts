import { TestBed } from '@angular/core/testing';

import { ContentAccessGuard } from './content-access.guard';

describe('ContentAccessGuard', () => {
  let guard: ContentAccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ContentAccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
