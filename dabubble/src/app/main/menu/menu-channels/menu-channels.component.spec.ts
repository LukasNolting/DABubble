import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuChannelsComponent } from './menu-channels.component';

describe('MenuChannelsComponent', () => {
  let component: MenuChannelsComponent;
  let fixture: ComponentFixture<MenuChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuChannelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
