import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedSearchesListComponent } from './saved-searches-list.component';

describe('SavedSearchesListComponent', () => {
  let component: SavedSearchesListComponent;
  let fixture: ComponentFixture<SavedSearchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedSearchesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavedSearchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
