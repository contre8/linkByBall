import { TestBed } from '@angular/core/testing';

import { AuthNavigationService } from './auth-navigation.service';

describe('AuthNavigationService', () => {
  let service: AuthNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
