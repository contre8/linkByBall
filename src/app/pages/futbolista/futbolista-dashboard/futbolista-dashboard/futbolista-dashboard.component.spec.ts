import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutbolistaDashboardComponent } from './futbolista-dashboard.component';

describe('FutbolistaDashboardComponent', () => {
  let component: FutbolistaDashboardComponent;
  let fixture: ComponentFixture<FutbolistaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FutbolistaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FutbolistaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
