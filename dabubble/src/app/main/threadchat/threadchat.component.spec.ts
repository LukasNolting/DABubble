import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadchatComponent } from './threadchat.component';

describe('ThreadchatComponent', () => {
  let component: ThreadchatComponent;
  let fixture: ComponentFixture<ThreadchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
