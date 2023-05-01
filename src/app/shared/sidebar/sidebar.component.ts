import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy{

  nombre: string | undefined = "" ;
  userSubs!: Subscription;
 
  constructor( private autService: AuthService, private router: Router, private store: Store<AppState> ) {}

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
      //pipe se puso para evitar usar el operador "?", pero al final hay que ponerlo porque sino da error
      // .pipe(
      //   filter( ({ user }) =>  user != null )
      // )
      .subscribe( ({ user }) => this.nombre = user?.nombre);      
  }

  logout() {    
    this.autService.logout().then( () => {
      this.router.navigate(['/login']);
    });    
  }

  ngOnDestroy(): void {    
    this.userSubs.unsubscribe();
  }
}
