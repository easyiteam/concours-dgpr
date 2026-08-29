import axios from 'axios';

// Contrairement à scorer/src/api/index.ts (URL de prod codée en dur, et par
// erreur vers le domaine dgefc-recrutement), on suit la convention déjà
// utilisée par dashboard/ et web/ : l'URL de l'API vient d'une variable
// d'environnement Vite, configurée au déploiement.
export const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:7020',
});

export function setApiToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
