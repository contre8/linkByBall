import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisAvisosComponent } from './mis-avisos.component';

describe('MisAvisosComponent', () => {
  let component: MisAvisosComponent;
  let fixture: ComponentFixture<MisAvisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisAvisosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisAvisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
