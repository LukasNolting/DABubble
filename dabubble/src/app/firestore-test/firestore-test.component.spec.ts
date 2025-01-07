import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirestoreTestComponent } from './firestore-test.component';

describe('FirestoreTestComponent', () => {
  let component: FirestoreTestComponent;
  let fixture: ComponentFixture<FirestoreTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirestoreTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirestoreTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
