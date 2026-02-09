import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackedDeviceMap } from './tracked-device-map';

describe('TrackedDeviceMap', () => {
  let component: TrackedDeviceMap;
  let fixture: ComponentFixture<TrackedDeviceMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackedDeviceMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackedDeviceMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
