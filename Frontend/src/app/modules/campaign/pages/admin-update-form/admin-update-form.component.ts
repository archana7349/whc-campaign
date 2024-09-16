import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-update-form',
  templateUrl: './admin-update-form.component.html',
  styleUrls: ['./admin-update-form.component.scss'],
})
export class AdminUpdateFormComponent {
  updateForm!: FormGroup;
  booketSeries: any = [];
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackbar: MatSnackBar
  ) {}
  ngOnInit() {
    this.updateForm = this.fb.group({
      bookletSeries: [null, Validators.required],
      branchName: ['', Validators.required],
      outletName: ['', Validators.required],
    });
    this.getBookletSeries();
  }
  getBookletSeries() {
    this.apiService.getBookletSeries().subscribe({
      next: (res: any) => {
        if (res?.code === 200) {
          this.booketSeries = res?.booklets;
        }
      },
      error: (error: any) => {
        this.snackbar.open(error?.message || 'Unable to fetch Booklet series');
      },
    });
  }
  onSubmit() {
    let body = {
      booklet: this.updateForm.get('bookletSeries')?.value?.series || null,
      couponType: this.updateForm.get('bookletSeries')?.value?.model || null,
      branch: this.updateForm.get('branchName')?.value || null,
      outlet: this.updateForm.get('outletName')?.value || null,
    };
    if (body.booklet && body.couponType && body.branch && body.outlet) {
      this.apiService.updateForm(body).subscribe({
        next: (res: any) => {
          if (res?.code === 200) {
            this.snackbar.open(res?.message || '', 'close', {
              duration: 3000,
            });
          }
        },
        error: (error: any) => {
          this.snackbar.open(
            error?.message || 'Something went wrong, Please try again',
            'close',
            {
              duration: 3000,
            }
          );
        },
      });
    } else {
      this.snackbar.open('Please fill all required field', 'close', {
        duration: 3000,
      });
    }
  }
}
