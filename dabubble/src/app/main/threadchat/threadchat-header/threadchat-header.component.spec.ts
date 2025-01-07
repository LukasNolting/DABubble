import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadchatHeaderComponent } from './threadchat-header.component';

describe('ThreadchatHeaderComponent', () => {
  let component: ThreadchatHeaderComponent;
  let fixture: ComponentFixture<ThreadchatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadchatHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadchatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
