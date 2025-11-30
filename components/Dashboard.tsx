import React from 'react';
import { Client, Transaction, Appointment } from '../types';
import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  clients: Client[];
  transactions: Transaction[];
  appointments: Appointment[];
}

export const Dashboard: React.FC<DashboardProps> = ({ clients, transactions, appointments }) => {
  // Calculate Stats
  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeClients = clients.length;
  
  const upcomingShoots = appointments.filter(a => {
    return new Date(a.date) >= new Date();
  }).length;

  const monthlyData = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Fev', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 }, // Simulated high expense (equipment)
    { name: 'Abr', income: 2780, expense: 3908 },
    { name: 'Mai', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
  ];

  // In a real app, we would aggregate `transactions` into `monthlyData` dynamically.

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 font-medium">{title}</h3>
        <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Visão Geral</h2>
        <span className="text-sm text-slate-400">Hoje: {new Date().toLocaleDateString('pt-BR')}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Receita Total" 
          value={`R$ ${totalRevenue.toLocaleString('pt-BR')}`} 
          icon={DollarSign} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Clientes Ativos" 
          value={activeClients} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Ensaios Agendados" 
          value={upcomingShoots} 
          icon={Calendar} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Taxa de Conversão" 
          value="68%" 
          icon={TrendingUp} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-6">Fluxo de Caixa (Semestral)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="income" name="Receita" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Shoots */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Próximos Ensaios</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {appointments.slice(0, 4).map(appt => (
              <div key={appt.id} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 font-bold text-sm flex-col leading-none">
                  <span>{new Date(appt.date).getDate()}</span>
                  <span className="text-[10px] uppercase">{new Date(appt.date).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{appt.title}</h4>
                  <p className="text-sm text-slate-400 truncate">{appt.location}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${appt.completed ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {appt.completed ? 'Concluído' : 'Pendente'}
                </span>
              </div>
            ))}
            {appointments.length === 0 && (
              <p className="text-slate-500 text-center py-4">Nenhum ensaio agendado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
