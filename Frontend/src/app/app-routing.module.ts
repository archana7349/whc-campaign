import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ErrorPageComponent } from './core/components/error-page/error-page.component';
// import { LoginComponent } from './modules/auth/pages/login/login.component';

const routes: Routes = [
  {path:"",loadChildren:()=>import("./modules/campaign/campaign.module").then(r=>r.CampaignModule)},
  {
    path: '404',
    component: NotFoundComponent,
  },
  {
    path: '**',
    component: ErrorPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
