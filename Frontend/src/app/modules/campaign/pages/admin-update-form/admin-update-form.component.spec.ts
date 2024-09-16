import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateFormComponent } from './admin-update-form.component';

describe('AdminUpdateFormComponent', () => {
  let component: AdminUpdateFormComponent;
  let fixture: ComponentFixture<AdminUpdateFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUpdateFormComponent]
    });
    fixture = TestBed.createComponent(AdminUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
