import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { UpiVerificationComponent } from './pages/upi-verification/upi-verification.component';
import { GreetingComponent } from './pages/greeting/greeting.component';
import { RedeemedComponent } from './pages/redeemed/redeemed.component';
import { authAdminGuard, authGuard } from 'src/app/core/guards/auth/auth.guard';
import { AdminReportsComponent } from './pages/admin-reports/admin-reports.component';
import { AdminUpdateFormComponent } from './pages/admin-update-form/admin-update-form.component';
import { TestingComponent } from './pages/testing/testing.component';

const routes: Routes = [
  {path:"",component:RegisterComponent},
  {path:"admin/reports",component:AdminReportsComponent,canActivate:[authAdminGuard]},
  {path:"admin/update-outlet",component:AdminUpdateFormComponent,canActivate:[authAdminGuard]},
  {path:"redeem",component:UpiVerificationComponent,canActivate:[authGuard]},
  {path:"purchased",component:GreetingComponent,canActivate:[authGuard]},
  {path:"redeemed",component:RedeemedComponent,canActivate:[authGuard]},
  {path:"testing",component:TestingComponent},
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignRoutingModule { }
