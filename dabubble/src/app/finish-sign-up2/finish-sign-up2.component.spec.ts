import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishSignUp2Component } from './finish-sign-up2.component';

describe('FinishSignUp2Component', () => {
  let component: FinishSignUp2Component;
  let fixture: ComponentFixture<FinishSignUp2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishSignUp2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinishSignUp2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
