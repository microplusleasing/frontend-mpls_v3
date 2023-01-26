import { TestBed } from '@angular/core/testing';

import { ImageUtilService } from './image-util.service';

describe('ImageUtilService', () => {
  let service: ImageUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
