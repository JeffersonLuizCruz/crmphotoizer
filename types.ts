export enum ClientStatus {
  LEAD = 'Potencial',
  CONTACTED = 'Contatado',
  BOOKED = 'Agendado',
  COMPLETED = 'Concluído'
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: ClientStatus;
  notes?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  title: string;
  date: string; // ISO string
  location: string;
  type: 'Ensaios' | 'Casamento' | 'Evento' | 'Corporativo';
  completed: boolean;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO string
  type: 'income' | 'expense';
  category: string;
}

export interface AIConceptResponse {
  title: string;
  mood: string;
  lighting: string;
  outfitSuggestions: string[];
  poseIdeas: string[];
}

export type ViewState = 'dashboard' | 'clients' | 'calendar' | 'finance' | 'ai-assistant';
