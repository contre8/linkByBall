import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClubComponent } from './club-dashboard.component';


describe('ClubDashboardComponent', () => {
  let component: DashboardClubComponent;
  let fixture: ComponentFixture<DashboardClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
