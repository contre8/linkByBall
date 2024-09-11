import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFutbolistaComponent } from './register-futbolista.component';

describe('RegisterFutbolistaComponent', () => {
  let component: RegisterFutbolistaComponent;
  let fixture: ComponentFixture<RegisterFutbolistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFutbolistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFutbolistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
