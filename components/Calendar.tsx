import React, { useState } from 'react';
import { Appointment } from '../types';
import { ChevronLeft, ChevronRight, MapPin, Clock, Calendar as CalendarIcon, Grid, List } from 'lucide-react';

interface CalendarProps {
  appointments: Appointment[];
}

type ViewMode = 'day' | 'week' | 'month';

export const CalendarView: React.FC<CalendarProps> = ({ appointments }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getTitle = () => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    if (viewMode === 'day') options.day = 'numeric';
    return currentDate.toLocaleDateString('pt-BR', options);
  };

  const getEventsForDay = (date: Date) => {
    return appointments.filter(a => {
      const d = new Date(a.date);
      return d.getDate() === date.getDate() &&
             d.getMonth() === date.getMonth() &&
             d.getFullYear() === date.getFullYear();
    });
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    return (
      <div className="flex flex-col h-full animate-fade-in">
         <div className="grid grid-cols-7 border-b border-slate-700 bg-slate-900/50">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="py-3 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {days.map((date, idx) => {
            if (!date) return <div key={idx} className="bg-slate-900/20 border-b border-r border-slate-700/50" />;
            
            const events = getEventsForDay(date);
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <div key={idx} className="min-h-[100px] border-b border-r border-slate-700/50 p-2 relative hover:bg-slate-700/10 transition-colors">
                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                  {date.getDate()}
                </span>
                <div className="space-y-1">
                  {events.map(event => (
                     <div key={event.id} className="text-xs bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 p-1.5 rounded truncate cursor-pointer hover:bg-indigo-500/30 transition-colors">
                        {event.title}
                     </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay(); // 0 (Sun) to 6 (Sat)
    startOfWeek.setDate(startOfWeek.getDate() - day); // Go back to Sunday

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      weekDays.push(d);
    }

    return (
       <div className="flex flex-col h-full overflow-hidden animate-fade-in">
        <div className="grid grid-cols-7 border-b border-slate-700 bg-slate-900/50">
          {weekDays.map(date => {
             const isToday = new Date().toDateString() === date.toDateString();
             return (
              <div key={date.toString()} className={`py-3 text-center border-r border-slate-700/30 last:border-r-0 ${isToday ? 'bg-indigo-900/20' : ''}`}>
                <div className="text-xs font-medium text-slate-500 uppercase">{date.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                <div className={`text-lg font-bold ${isToday ? 'text-indigo-400' : 'text-white'}`}>{date.getDate()}</div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 flex-1 overflow-y-auto divide-x divide-slate-700/30">
           {weekDays.map(date => {
             const events = getEventsForDay(date);
             return (
               <div key={date.toString()} className="min-h-[200px] p-2 space-y-2 hover:bg-slate-800/20 transition-colors">
                 {events.map(event => (
                   <div key={event.id} className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-lg group hover:bg-indigo-600/30 transition-colors cursor-pointer">
                      <p className="text-xs font-bold text-indigo-200 mb-0.5">{new Date(event.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="text-sm text-white truncate group-hover:whitespace-normal">{event.title}</p>
                   </div>
                 ))}
               </div>
             )
           })}
        </div>
       </div>
    );
  };

  const renderDayView = () => {
    const events = getEventsForDay(currentDate);
    
    return (
      <div className="flex-1 overflow-y-auto p-6 animate-fade-in bg-slate-800/50">
        <div className="space-y-4 max-w-4xl mx-auto">
          {events.length === 0 && (
             <div className="text-center py-20 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center text-slate-500 mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <p className="text-slate-400 text-lg">Nenhum evento agendado para este dia.</p>
                <p className="text-slate-600 text-sm mt-1">Aproveite para organizar suas fotos ou descansar!</p>
             </div>
          )}
          {events.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
            <div key={event.id} className="flex gap-6 p-5 bg-slate-800 border border-slate-700 rounded-xl hover:border-indigo-500/50 transition-colors shadow-sm">
               <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-slate-700 pr-6">
                 <span className="text-2xl font-bold text-white">{new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                 <span className={`mt-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${event.completed ? 'bg-green-500/10 text-green-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                   {event.type}
                 </span>
               </div>
               <div className="flex-1">
                 <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-500"/> {event.location}</span>
                    <span className={`flex items-center gap-1.5 ${event.completed ? 'text-green-400' : 'text-amber-400'}`}>
                       <div className={`w-2 h-2 rounded-full ${event.completed ? 'bg-green-400' : 'bg-amber-400'}`} />
                       {event.completed ? 'Concluído' : 'Pendente'}
                    </span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-white">Agenda</h2>
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
             <button 
               onClick={() => setViewMode('month')} 
               className={`p-2 rounded-md transition-colors ${viewMode === 'month' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
               title="Visualização Mensal"
             >
               <Grid className="w-4 h-4"/>
             </button>
             <button 
               onClick={() => setViewMode('week')} 
               className={`p-2 rounded-md transition-colors ${viewMode === 'week' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
               title="Visualização Semanal"
             >
               <CalendarIcon className="w-4 h-4"/>
             </button>
             <button 
               onClick={() => setViewMode('day')} 
               className={`p-2 rounded-md transition-colors ${viewMode === 'day' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
               title="Visualização Diária"
             >
               <List className="w-4 h-4"/>
             </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-800 p-1 rounded-lg border border-slate-700 self-end md:self-auto">
          <button onClick={() => navigate('prev')} className="p-2 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-white font-medium capitalize w-48 text-center select-none">{getTitle()}</span>
          <button onClick={() => navigate('next')} className="p-2 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 flex-1 overflow-hidden flex flex-col shadow-xl">
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>
      
      {viewMode === 'month' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <h3 className="font-bold text-white mb-3 text-sm">Próximos 7 dias</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {appointments
                .filter(a => {
                  const d = new Date(a.date);
                  const now = new Date();
                  const diffTime = d.getTime() - now.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                  return diffDays >= 0 && diffDays <= 7;
                })
                .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 3)
                .map(apt => (
               <div key={apt.id} className="flex gap-3 items-start bg-slate-700/30 p-3 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                 <div className="bg-slate-700 p-2 rounded text-center min-w-[50px]">
                   <span className="block text-lg font-bold text-white leading-none">{new Date(apt.date).getDate()}</span>
                   <span className="block text-[10px] text-slate-400 uppercase">{new Date(apt.date).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                 </div>
                 <div className="min-w-0">
                   <p className="text-white font-medium text-sm truncate">{apt.title}</p>
                   <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(apt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })}</span>
                   </div>
                   <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{apt.location}</span>
                   </div>
                 </div>
               </div>
             ))}
             {appointments.filter(a => {
                  const d = new Date(a.date);
                  const now = new Date();
                  const diffTime = d.getTime() - now.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                  return diffDays >= 0 && diffDays <= 7;
                }).length === 0 && (
                <p className="text-sm text-slate-500 py-2">Nenhum evento próximo.</p>
             )}
          </div>
        </div>
      )}
    </div>
  );
};
