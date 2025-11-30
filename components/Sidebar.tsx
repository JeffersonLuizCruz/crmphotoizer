import React from 'react';
import { LayoutDashboard, Users, Calendar, DollarSign, Sparkles, Camera } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'calendar', label: 'Agenda', icon: Calendar },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'ai-assistant', label: 'IA Criativa', icon: Sparkles },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Camera className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Lumina CRM</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">Status do Sistema</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm text-slate-300">Online & Sincronizado</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
