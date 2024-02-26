import { RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';

export const routesToExclude: (string | RouteInfo)[] = [
  { path: '/events', method: RequestMethod.GET },
  { path: '/healthy', method: RequestMethod.GET },
  { path: '/test-email', method: RequestMethod.GET },
  { path: '/auth/login', method: RequestMethod.POST },
  { path: '/auth/reset-password', method: RequestMethod.POST },
  { path: '/auth/set-password', method: RequestMethod.POST },
  { path: '/auth/define-password/(.*)', method: RequestMethod.GET },
  { path: '/validators/define-pin/(.*)', method: RequestMethod.GET },
  { path: '/validators/(.*)', method: RequestMethod.PATCH },
  { path: '/validators/accept-revocation/(.*)', method: RequestMethod.GET },
  { path: '/validators/accept-validation/(.*)', method: RequestMethod.GET },
  { path: '/validators/validation/(.*)', method: RequestMethod.PATCH },
  { path: '/file/download/(.*)', method: RequestMethod.GET },
  { path: '/file/upload', method: RequestMethod.POST },
  { path: '/documents', method: RequestMethod.GET },
  { path: '/documents/(.*)', method: RequestMethod.PATCH },
  { path: '/exams/(.*)', method: RequestMethod.GET },
  { path: '/candidatures', method: RequestMethod.POST },
  { path: '/candidatures/(.*)/template', method: RequestMethod.GET },
  { path: '/candidatures/(.*)/info', method: RequestMethod.GET },
  { path: '/writings/(.*)/info', method: RequestMethod.GET },
  { path: '/candidatures/(.*)', method: RequestMethod.PATCH },
  { path: 'steps/current-step/(.*)', method: RequestMethod.GET },
];
