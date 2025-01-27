import { TestBed } from '@angular/core/testing';

import { FutbolistaService } from './futbolista.service';

describe('FutbolistaService', () => {
  let service: FutbolistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FutbolistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
