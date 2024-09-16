import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemStatusUpdateComponent } from './redeem-status-update.component';

describe('RedeemStatusUpdateComponent', () => {
  let component: RedeemStatusUpdateComponent;
  let fixture: ComponentFixture<RedeemStatusUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedeemStatusUpdateComponent]
    });
    fixture = TestBed.createComponent(RedeemStatusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
