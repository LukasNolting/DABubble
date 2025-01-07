import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemessageComponent } from './createmessage.component';

describe('CreatemessageComponent', () => {
  let component: CreatemessageComponent;
  let fixture: ComponentFixture<CreatemessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatemessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatemessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
