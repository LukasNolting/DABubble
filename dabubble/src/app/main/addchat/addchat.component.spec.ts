import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddchatComponent } from './addchat.component';

describe('AddchatComponent', () => {
  let component: AddchatComponent;
  let fixture: ComponentFixture<AddchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddchatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
