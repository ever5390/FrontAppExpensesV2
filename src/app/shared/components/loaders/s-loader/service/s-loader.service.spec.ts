import { TestBed } from '@angular/core/testing';

import { SLoaderService } from './s-loader.service';

describe('SLoaderService', () => {
  let service: SLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
