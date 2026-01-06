import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseDevices } from './close-devices';

describe('CloseDevices', () => {
  let component: CloseDevices;
  let fixture: ComponentFixture<CloseDevices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseDevices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseDevices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
