import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorServiceListComponent } from './doctor-service-list.component';

describe('DoctorServiceListComponent', () => {
  let component: DoctorServiceListComponent;
  let fixture: ComponentFixture<DoctorServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorServiceListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
