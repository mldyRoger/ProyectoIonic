import { TestBed } from '@angular/core/testing';

import { ConectionRealTimeService } from './conection-real-time.service';

describe('ConectionRealTimeService', () => {
  let service: ConectionRealTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConectionRealTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
