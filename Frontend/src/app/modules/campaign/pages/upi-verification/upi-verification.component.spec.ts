import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpiVerificationComponent } from './upi-verification.component';

describe('UpiVerificationComponent', () => {
  let component: UpiVerificationComponent;
  let fixture: ComponentFixture<UpiVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpiVerificationComponent]
    });
    fixture = TestBed.createComponent(UpiVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
