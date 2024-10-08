import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacantesDashboardComponent } from './vacantes-dashboard.component';

describe('VacantesDashboardComponent', () => {
  let component: VacantesDashboardComponent;
  let fixture: ComponentFixture<VacantesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacantesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacantesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
