import { TestBed } from '@angular/core/testing';

import { AdminpanelService } from './adminpanel.service';

describe('AdminpanelService', () => {
  let service: AdminpanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminpanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
