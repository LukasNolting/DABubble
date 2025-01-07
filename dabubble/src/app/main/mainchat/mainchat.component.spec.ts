import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainchatComponent } from './mainchat.component';

describe('MainchatComponent', () => {
  let component: MainchatComponent;
  let fixture: ComponentFixture<MainchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
