import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDialogUpdateComponent } from './appointment-dialog-update.component';

describe('AppointmentDialogUpdateComponent', () => {
  let component: AppointmentDialogUpdateComponent;
  let fixture: ComponentFixture<AppointmentDialogUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentDialogUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentDialogUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
