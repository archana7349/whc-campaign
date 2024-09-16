import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { REDIRECT_INTERVAL } from 'src/app/shared/constant/constant';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
})
export class ErrorPageComponent implements OnInit {
  countdown: number = REDIRECT_INTERVAL;

  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.startCountdown();
    this.navigateToHome();
  }

  private async startCountdown(): Promise<void> {
    return new Promise<void>((resolve) => {
      const countdownInterval = setInterval(() => {
        this.countdown--;

        if (this.countdown === 0) {
          clearInterval(countdownInterval);
          resolve();
        }
      }, 1000);
    });
  }

  private navigateToHome(): void {
    this.router.navigate(['']);
  }
}
