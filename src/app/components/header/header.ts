import { Component, inject, signal } from '@angular/core';
import { Supaservice } from '../../services/supaservice';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Session } from '@supabase/supabase-js';

@Component({
  selector: 'app-header',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private supaservice: Supaservice = inject(Supaservice);
  router: Router = inject(Router);
  session = signal<Session | null>({} as Session);
  searchString = '';

  search($event : string) {
    this.supaservice.setSearchString($event);
  }

  setSearch() {
    this.router.navigate(['/plantes',this.searchString]);
  }

  constructor() {
    this.supaservice.authChangesObservable().subscribe(({ event, session }) => {
      this.session.set(session);
    });
  }

  async logout() {
    await this.supaservice.logout();
    this.router.navigate(['/home']);
  }

}
