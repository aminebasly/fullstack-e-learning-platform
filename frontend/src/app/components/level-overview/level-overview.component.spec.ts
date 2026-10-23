import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelOverviewComponent } from './level-overview.component';

describe('LevelOverviewComponent', () => {
  let component: LevelOverviewComponent;
  let fixture: ComponentFixture<LevelOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
