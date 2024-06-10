import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedSearchedComponent } from './saved-searched.component';

describe('SavedSearchedComponent', () => {
  let component: SavedSearchedComponent;
  let fixture: ComponentFixture<SavedSearchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedSearchedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavedSearchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
