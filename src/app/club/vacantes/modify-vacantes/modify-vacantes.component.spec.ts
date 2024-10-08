import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyVacantesComponent } from './modify-vacantes.component';

describe('ModifyVacantesComponent', () => {
  let component: ModifyVacantesComponent;
  let fixture: ComponentFixture<ModifyVacantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyVacantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyVacantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
