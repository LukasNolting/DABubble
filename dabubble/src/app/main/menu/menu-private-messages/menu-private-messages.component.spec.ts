import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPrivateMessagesComponent } from './menu-private-messages.component';

describe('MenuPrivateMessagesComponent', () => {
  let component: MenuPrivateMessagesComponent;
  let fixture: ComponentFixture<MenuPrivateMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPrivateMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPrivateMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
