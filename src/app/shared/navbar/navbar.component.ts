import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  userName!: string | undefined;
  userSubs!: Subscription;

  constructor(private store:Store<AppState>){}

  ngOnInit(): void {
    this.userSubs = this.store.select('user').subscribe( item => this.userName = item.user?.nombre);
  } 

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

}
