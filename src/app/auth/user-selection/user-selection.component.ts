import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
//import { MatButtonModule } from '@angular/material/button'; // Si usas Angular Material

@Component({
  selector: 'app-user-selection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.scss']
})
export class UserSelectionComponent {
  selectedUserType: string | null = null;

  constructor(private router: Router) {}

  selectUserType(userType: string) {
    this.selectedUserType = userType;
  }

  isSelected(userType: string): boolean {
    return this.selectedUserType === userType;
  }

  goToRegister() {
    if (this.selectedUserType) {
      this.router.navigate([`/auth/register/${this.selectedUserType}`]);
    }
  }
}
