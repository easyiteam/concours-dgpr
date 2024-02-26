import { Candidature } from '../api/candidature.api';

export class CandidatureStore {
  static candidature: Candidature | null = null;

  static set(value: Candidature) {
    CandidatureStore.candidature = value;
  }

  static get(): Candidature | null {
    return CandidatureStore.candidature;
  }
}
