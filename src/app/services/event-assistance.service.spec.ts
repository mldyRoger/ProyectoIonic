import { TestBed } from '@angular/core/testing';

import { EventAssistanceService } from './event-assistance.service';

describe('EventAssistanceService', () => {
  let service: EventAssistanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventAssistanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
