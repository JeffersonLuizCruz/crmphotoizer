import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { CalendarView } from './components/Calendar';
import { Finance } from './components/Finance';
import { AIAssistant } from './components/AIAssistant';
import { ViewState, Client, Transaction, Appointment, ClientStatus } from './types';

// Mock Data
const INITIAL_CLIENTS: Client[] = [
  { id: '1', name: 'Juliana Paes', email: 'ju.paes@example.com', phone: '(11) 99999-1234', status: ClientStatus.BOOKED, createdAt: '2023-10-15', notes: 'Prefere contatos via WhatsApp no período da tarde.' },
  { id: '2', name: 'Carlos Andrade', email: 'carlos.a@example.com', phone: '(21) 98888-5678', status: ClientStatus.LEAD, createdAt: '2023-11-02' },
  { id: '3', name: 'Mariana Ximenes', email: 'mari.x@example.com', phone: '(11) 97777-4321', status: ClientStatus.COMPLETED, createdAt: '2023-09-10', notes: 'Cliente VIP. Enviou feedback positivo sobre o álbum.' },
  { id: '4', name: 'Roberto Firmino', email: 'boby@example.com', phone: '(41) 99999-9999', status: ClientStatus.CONTACTED, createdAt: '2023-11-05' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Ensaio Casamento Juliana', amount: 3500, date: '2023-10-20', type: 'income', category: 'Serviços' },
  { id: '2', description: 'Compra Lente 85mm', amount: 4200, date: '2023-10-25', type: 'expense', category: 'Equipamento' },
  { id: '3', description: 'Sinal Ensaio Gestante', amount: 500, date: '2023-11-01', type: 'income', category: 'Serviços' },
  { id: '4', description: 'Assinatura Adobe', amount: 120, date: '2023-11-05', type: 'expense', category: 'Software' },
  { id: '5', description: 'Álbum Impresso Mariana', amount: 800, date: '2023-11-10', type: 'income', category: 'Produtos' },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: '1', clientId: '1', title: 'Casamento Juliana & Pedro', date: new Date().toISOString(), location: 'Sitio São Jorge', type: 'Casamento', completed: false },
  { id: '2', clientId: '3', title: 'Entrega de Álbum', date: '2023-11-15T14:00:00', location: 'Estúdio', type: 'Ensaios', completed: false },
  { id: '3', clientId: '4', title: 'Reunião Pré-evento', date: '2023-11-18T10:00:00', location: 'Google Meet', type: 'Corporativo', completed: false },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // App State
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  const handleAddClient = (newClient: Client) => {
    setClients(prev => [...prev, newClient]);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleAddAppointment = (newAppointment: Appointment) => {
    setAppointments(prev => [...prev, newAppointment]);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard clients={clients} transactions={transactions} appointments={appointments} />;
      case 'clients':
        return <Clients 
          clients={clients} 
          onAddClient={handleAddClient} 
          onUpdateClient={handleUpdateClient}
          onDeleteClient={handleDeleteClient}
          onAddAppointment={handleAddAppointment}
        />;
      case 'calendar':
        return <CalendarView appointments={appointments} />;
      case 'finance':
        return <Finance transactions={transactions} onAddTransaction={handleAddTransaction} />;
      case 'ai-assistant':
        return <AIAssistant />;
      default:
        return <Dashboard clients={clients} transactions={transactions} appointments={appointments} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 h-screen overflow-hidden">
        <div className="h-full max-w-7xl mx-auto flex flex-col">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;