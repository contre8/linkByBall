import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEntrenadorComponent } from './register-entrenador.component';

describe('RegisterEntrenadorComponent', () => {
  let component: RegisterEntrenadorComponent;
  let fixture: ComponentFixture<RegisterEntrenadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterEntrenadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterEntrenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
