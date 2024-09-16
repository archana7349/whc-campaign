import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignRoutingModule } from './campaign-routing.module';
import { RegisterComponent } from './pages/register/register.component';
import { UpiVerificationComponent } from './pages/upi-verification/upi-verification.component';
import { GreetingComponent } from './pages/greeting/greeting.component';
import { RedeemedComponent } from './pages/redeemed/redeemed.component';
import { CoreModule } from 'src/app/core/core.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from "@angular/material/button"
import {MatDialogModule} from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCardModule} from "@angular/material/card";
import { TermsAndConditionsComponent } from './pages/popups/terms-and-conditions/terms-and-conditions.component'
import {  MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminReportsComponent } from './pages/admin-reports/admin-reports.component';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CurrencyFormatPipe, DateFormatPipe } from 'src/app/shared/customPipe/pipe';
import { AdminUpdateFormComponent } from './pages/admin-update-form/admin-update-form.component';
import { TestingComponent } from './pages/testing/testing.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { RedeemStatusUpdateComponent } from './pages/popups/redeem-status-update/redeem-status-update.component';
import { QrScannerComponent } from './pages/popups/qr-scanner/qr-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  declarations: [
    RegisterComponent,
    UpiVerificationComponent,
    GreetingComponent,
    RedeemedComponent,
    LoginComponent,
    TermsAndConditionsComponent,
    AdminReportsComponent,
    CurrencyFormatPipe,
    DateFormatPipe,
    AdminUpdateFormComponent,
    TestingComponent,
    RedeemStatusUpdateComponent,
    QrScannerComponent
  ],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    CoreModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatCheckboxModule,
    ZXingScannerModule
  ],
  providers:[ApiService]
})
export class CampaignModule { }
