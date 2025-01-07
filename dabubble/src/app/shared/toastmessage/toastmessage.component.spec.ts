import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastmessageComponent } from './toastmessage.component';

describe('ToastmessageComponent', () => {
  let component: ToastmessageComponent;
  let fixture: ComponentFixture<ToastmessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastmessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToastmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
