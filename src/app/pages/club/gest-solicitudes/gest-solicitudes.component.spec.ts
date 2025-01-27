import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestSolicitudesComponent } from './gest-solicitudes.component';

describe('GestSolicitudesComponent', () => {
  let component: GestSolicitudesComponent;
  let fixture: ComponentFixture<GestSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestSolicitudesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
