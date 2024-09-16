import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ADMIN } from 'src/app/shared/constant/constant';

export const authGuard: CanActivateFn = (route, state) => {
  const  authService = inject(AuthService);
  const  router= inject(Router)
  const authDetails = authService.getAuthStatus();
  if(!authDetails){
    router.navigate(['']);
  }

  if(authDetails?.user_role == ADMIN){
    console.log(">>>>>>",authDetails?.user_role,ADMIN)
    router.navigate(['admin/reports']);
    return false
  }
  
  return !!authDetails;
};

export const authAdminGuard: CanActivateFn = (route, state) => {
  const  authService = inject(AuthService);
  const  router= inject(Router)
  const authDetails = authService.getAuthStatus();
  if(authDetails?.user_role !== ADMIN){
    router.navigate(['']);
  }
  
  return !!authDetails;
};