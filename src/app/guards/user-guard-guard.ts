import { CanActivateFn, Route, Router, UrlTree } from '@angular/router';
import { Supaservice } from '../services/supaservice';
import { inject } from '@angular/core';

export const userGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const supaservice: Supaservice = inject(Supaservice);
  const urlTree: UrlTree = router.parseUrl('/home');
  return supaservice.loggedSubject.getValue() ? true : urlTree;
};
