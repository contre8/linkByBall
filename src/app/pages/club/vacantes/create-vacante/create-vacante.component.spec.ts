import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVacanteComponent } from './create-vacante.component';

describe('CreateVacanteComponent', () => {
  let component: CreateVacanteComponent;
  let fixture: ComponentFixture<CreateVacanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateVacanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVacanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
