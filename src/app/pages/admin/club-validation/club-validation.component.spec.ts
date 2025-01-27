import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubValidationComponent } from './club-validation.component';

describe('ClubValidationComponent', () => {
  let component: ClubValidationComponent;
  let fixture: ComponentFixture<ClubValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
