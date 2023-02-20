import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {

  constructor( private autService: AuthService, private router: Router ) {}

  logout() {
    this.autService.logout().then( () => {
      this.router.navigate(['/login']);
    });    
  }
}
