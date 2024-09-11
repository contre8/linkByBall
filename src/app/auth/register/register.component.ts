import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthNavigationService } from '../services/auth-navigation.service';

@Component({
  selector: 'app-register',
  template: '',
})
export class RegisterComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authNavigationService: AuthNavigationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const type = params['type'];
      this.authNavigationService.navigateToRegistration(type);
    });
  }
}
