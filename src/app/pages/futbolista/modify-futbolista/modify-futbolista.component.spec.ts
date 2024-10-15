import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyFutbolistaComponent } from './modify-futbolista.component';

describe('ModifyFutbolistaComponent', () => {
  let component: ModifyFutbolistaComponent;
  let fixture: ComponentFixture<ModifyFutbolistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyFutbolistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyFutbolistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
