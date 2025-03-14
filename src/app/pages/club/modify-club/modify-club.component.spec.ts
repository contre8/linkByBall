import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyClubComponent } from './modify-club.component';

describe('ModifyClubComponent', () => {
  let component: ModifyClubComponent;
  let fixture: ComponentFixture<ModifyClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyClubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
