import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarVacantesComponent } from './buscar-vacantes.component';

describe('BuscarVacantesComponent', () => {
  let component: BuscarVacantesComponent;
  let fixture: ComponentFixture<BuscarVacantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarVacantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarVacantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
