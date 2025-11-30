import React, { useState } from 'react';
import { Transaction } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Plus, Filter } from 'lucide-react';

interface FinanceProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
}

export const Finance: React.FC<FinanceProps> = ({ transactions, onAddTransaction }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter(t => activeTab === 'all' ? true : t.type === activeTab);

  const pieData = [
    { name: 'Entradas', value: totalIncome, color: '#10b981' }, // Emerald 500
    { name: 'Saídas', value: totalExpense, color: '#ef4444' }, // Red 500
  ];

  // Mock data for area chart over time
  const areaData = transactions.slice().sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(t => ({
    date: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    amount: t.type === 'income' ? t.amount : -t.amount
  }));

  // Simplified accumulation for chart
  let acc = 0;
  const balanceHistory = areaData.map(d => {
    acc += d.amount;
    return { ...d, balance: acc };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Financeiro</h2>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Nova Transação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Saldo Total</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex justify-between items-end">
          <div>
            <p className="text-slate-400 text-sm mb-1">Receitas</p>
            <p className="text-2xl font-bold text-emerald-400">
              R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex justify-between items-end">
          <div>
            <p className="text-slate-400 text-sm mb-1">Despesas</p>
            <p className="text-2xl font-bold text-red-400">
              R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction History */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-white">Transações Recentes</h3>
            <div className="flex bg-slate-900 rounded-lg p-1">
              {(['all', 'income', 'expense'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                    activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'all' ? 'Todas' : tab === 'income' ? 'Entradas' : 'Saídas'}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-800">
                <tr className="text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-4 py-3 text-slate-200 font-medium">{t.description}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">{t.category}</span>
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-[240px]">
            <h3 className="font-bold text-white mb-4 text-sm">Distribuição</h3>
            <div className="h-full -mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                     itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
           <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex-1">
            <h3 className="font-bold text-white mb-4 text-sm">Evolução do Saldo</h3>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceHistory}>
                   <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                     itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#6366f1" fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
