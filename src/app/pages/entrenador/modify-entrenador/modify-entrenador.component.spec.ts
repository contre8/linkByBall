import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyEntrenadorComponent } from './modify-entrenador.component';

describe('ModifyEntrenadorComponent', () => {
  let component: ModifyEntrenadorComponent;
  let fixture: ComponentFixture<ModifyEntrenadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyEntrenadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyEntrenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
