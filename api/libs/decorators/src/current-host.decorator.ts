import { Env, ExecutionRequest } from '@app/shared';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentHost = createParamDecorator((_, ctx: ExecutionContext) => {
  const req: ExecutionRequest = ctx.switchToHttp().getRequest();
  // Dérivé de la requête réelle, pas d'un domaine codé en dur — ce fichier a
  // été copié depuis dgefc-recrutement avec son propre domaine en dur, ce
  // qui envoyait les liens d'emails (validateurs, candidatures) vers le
  // mauvais serveur en production.
  return Env.mode === 'development'
    ? `${req.protocol}://${req.get('host')}`
    : `https://${req.get('host')}`;
});
