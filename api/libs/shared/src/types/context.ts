import { Auth, AuthExam } from '@prisma/client';
import { Request } from 'express';

export type FullAuth = Partial<Auth & { exams: AuthExam[] }>;

export type ExecutionRequest = Request & {
  auth: FullAuth;
};
