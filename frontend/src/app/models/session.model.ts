import { Participant } from './participant.model';

export interface Session {
  nom: string;
  createur: string;
  produits: number[];
  participants: Participant[];
}
