import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageboxComponent } from './messagebox.component';

describe('MessageboxComponent', () => {
  let component: MessageboxComponent;
  let fixture: ComponentFixture<MessageboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
