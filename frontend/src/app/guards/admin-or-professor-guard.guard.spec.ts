import { TestBed } from '@angular/core/testing';

import { AdminOrProfessorGuardGuard } from './admin-or-professor-guard.guard';

describe('AdminOrProfessorGuardGuard', () => {
  let guard: AdminOrProfessorGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminOrProfessorGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
