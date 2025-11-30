import React, { useState } from 'react';
import { Client, ClientStatus, Appointment } from '../types';
import { Search, Plus, Mail, Phone, MoreHorizontal, User, X, Clock, FileText, Calendar, Save, MapPin, Filter, Trash2, Edit2, Check } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onAddAppointment: (appointment: Appointment) => void;
}

export const Clients: React.FC<ClientsProps> = ({ clients, onAddClient, onUpdateClient, onDeleteClient, onAddAppointment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ClientStatus | 'ALL'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // New Client Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Schedule Modal State
  const [apptTitle, setApptTitle] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptType, setApptType] = useState<'Ensaios' | 'Casamento' | 'Evento' | 'Corporativo'>('Ensaios');

  // Client Details/View State
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [notesInput, setNotesInput] = useState('');

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSaveNew = () => {
    if(!newName) return;
    const newClient: Client = {
      id: Date.now().toString(),
      name: newName,
      email: newEmail,
      phone: newPhone,
      status: ClientStatus.LEAD,
      createdAt: new Date().toISOString(),
      notes: ''
    };
    onAddClient(newClient);
    setNewName(''); setNewEmail(''); setNewPhone('');
    setShowAddModal(false);
  };

  const handleOpenDetails = (client: Client) => {
    setSelectedClient(client);
    setNotesInput(client.notes || '');
    setEditName(client.name);
    setEditEmail(client.email);
    setEditPhone(client.phone);
    setIsEditing(false);
  };

  const handleSaveNotes = () => {
    if (selectedClient) {
      const updatedClient = { ...selectedClient, notes: notesInput };
      onUpdateClient(updatedClient);
      setSelectedClient(updatedClient); // Update local view
    }
  };

  const handleSaveEdit = () => {
    if (!selectedClient) return;
    const updatedClient = {
      ...selectedClient,
      name: editName,
      email: editEmail,
      phone: editPhone,
      notes: notesInput // Save notes too if in global edit mode
    };
    onUpdateClient(updatedClient);
    setSelectedClient(updatedClient);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!selectedClient) return;
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${selectedClient.name}? Esta ação não pode ser desfeita.`)) {
      onDeleteClient(selectedClient.id);
      setSelectedClient(null);
    }
  };

  const handleOpenSchedule = () => {
    if (!selectedClient) return;
    setApptTitle(`Ensaio com ${selectedClient.name}`);
    // Default to tomorrow 10am
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setApptDate(tomorrow.toISOString().split('T')[0]);
    setApptTime('10:00');
    setShowScheduleModal(true);
  };

  const handleSaveAppointment = () => {
    if (!selectedClient || !apptTitle || !apptDate || !apptTime) return;
    
    const dateTime = new Date(`${apptDate}T${apptTime}:00`).toISOString();
    
    const newAppt: Appointment = {
      id: Date.now().toString(),
      clientId: selectedClient.id,
      title: apptTitle,
      date: dateTime,
      location: 'A definir',
      type: apptType,
      completed: false
    };

    onAddAppointment(newAppt);
    
    // Auto-update status to Booked if it was Lead or Contacted
    if (selectedClient.status === ClientStatus.LEAD || selectedClient.status === ClientStatus.CONTACTED) {
      const updatedClient = { ...selectedClient, status: ClientStatus.BOOKED };
      onUpdateClient(updatedClient);
      setSelectedClient(updatedClient);
    }

    setShowScheduleModal(false);
    alert('Agendamento criado com sucesso!');
  };

  const handleSendEmail = () => {
    if (!selectedClient?.email) return;
    window.location.href = `mailto:${selectedClient.email}?subject=Fotografia - ${selectedClient.name}`;
  };

  const getStatusColor = (status: ClientStatus) => {
    switch (status) {
      case ClientStatus.LEAD: return 'text-slate-400 bg-slate-700/50 border-slate-600';
      case ClientStatus.CONTACTED: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case ClientStatus.BOOKED: return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case ClientStatus.COMPLETED: return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Clientes</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-3 border border-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ClientStatus | 'ALL')}
            className="bg-transparent border-none text-white text-sm focus:ring-0 py-2 pr-8 cursor-pointer focus:outline-none"
            style={{ minWidth: '140px' }}
          >
            <option value="ALL" className="bg-slate-800 text-slate-300">Todos os Status</option>
            {Object.values(ClientStatus).map(status => (
              <option key={status} value={status} className="bg-slate-800 text-slate-300">
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Contato</th>
                <th className="px-6 py-4 font-medium">Cadastro</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredClients.map(client => (
                <tr 
                  key={client.id} 
                  onClick={() => handleOpenDetails(client)}
                  className="hover:bg-slate-700/30 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white group-hover:text-indigo-400 transition-colors">{client.name}</p>
                        <p className="text-sm text-slate-500">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs border font-medium ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="hover:text-indigo-400 transition-colors" title="Enviar Email"><Mail className="w-4 h-4" /></div>
                      <div className="hover:text-indigo-400 transition-colors" title="Ligar"><Phone className="w-4 h-4" /></div>
                      <span className="text-sm">{client.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-500 hover:text-white transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Adicionar Novo Cliente</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                <input 
                  type="email" 
                  value={newEmail} 
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Telefone</label>
                <input 
                  type="tel" 
                  value={newPhone} 
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveNew}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Agendar Ensaio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Título do Evento</label>
                <input 
                  type="text" 
                  value={apptTitle} 
                  onChange={e => setApptTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Data</label>
                  <input 
                    type="date" 
                    value={apptDate} 
                    onChange={e => setApptDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Hora</label>
                  <input 
                    type="time" 
                    value={apptTime} 
                    onChange={e => setApptTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Tipo de Serviço</label>
                <select 
                  value={apptType}
                  onChange={e => setApptType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Ensaios">Ensaio Fotográfico</option>
                  <option value="Casamento">Casamento</option>
                  <option value="Evento">Evento</option>
                  <option value="Corporativo">Corporativo</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveAppointment}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-800 rounded-2xl w-full max-w-4xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-slate-800 sticky top-0">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 border-2 border-slate-600 flex-shrink-0">
                  <User className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-2xl font-bold text-white bg-slate-900 border border-slate-600 rounded px-2 py-1 w-full max-w-md focus:border-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-white">{selectedClient.name}</h2>
                  )}
                  
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`px-2 py-0.5 rounded-full text-xs border font-medium ${getStatusColor(selectedClient.status)}`}>
                      {selectedClient.status}
                    </span>
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Cadastrado em {new Date(selectedClient.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                     <button 
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm transition-colors"
                    >
                      <X className="w-4 h-4" /> Cancelar
                    </button>
                    <button 
                      onClick={handleSaveEdit}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                    >
                      <Check className="w-4 h-4" /> Salvar
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
                      title="Editar Cliente"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                      title="Excluir Cliente"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-slate-700 mx-1"></div>
                    <button 
                      onClick={() => setSelectedClient(null)}
                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Info & Notes */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Contact Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border transition-colors ${isEditing ? 'bg-slate-900 border-indigo-500/50' : 'bg-slate-900/50 border-slate-700/50'}`}>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </p>
                    {isEditing ? (
                      <input 
                        type="email" 
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white focus:border-indigo-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white truncate">{selectedClient.email}</p>
                    )}
                  </div>
                  <div className={`p-4 rounded-xl border transition-colors ${isEditing ? 'bg-slate-900 border-indigo-500/50' : 'bg-slate-900/50 border-slate-700/50'}`}>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Telefone
                    </p>
                     {isEditing ? (
                      <input 
                        type="tel" 
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white focus:border-indigo-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white">{selectedClient.phone}</p>
                    )}
                  </div>
                </div>

                {/* Notes Section */}
                <div className="bg-slate-900/30 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" /> Notas & Observações
                    </h3>
                  </div>
                  <div className="p-4">
                    <textarea 
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
                      placeholder="Adicione preferências, detalhes importantes ou observações sobre o cliente..."
                    />
                    {!isEditing && (
                      <div className="flex justify-end mt-3">
                        <button 
                          onClick={handleSaveNotes}
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Save className="w-4 h-4" /> Salvar Notas
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Mock */}
                <div className="bg-slate-900/30 rounded-xl border border-slate-700 overflow-hidden">
                   <div className="p-4 border-b border-slate-700/50 bg-slate-900/50">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" /> Histórico de Interações
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="relative pl-4 border-l-2 border-slate-700 space-y-6">
                      {/* Timeline Item 1 */}
                      <div className="relative">
                        <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-green-500 ring-4 ring-slate-800"></div>
                        <p className="text-sm font-bold text-white">Ensaio Concluído</p>
                        <p className="text-xs text-slate-500 mb-1">20 de Out, 2023 - 16:30</p>
                        <p className="text-sm text-slate-400">Entrega final das fotos editadas realizada via link.</p>
                      </div>
                      
                      {/* Timeline Item 2 */}
                      <div className="relative">
                        <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-slate-800"></div>
                        <p className="text-sm font-bold text-white">Reunião de Alinhamento</p>
                        <p className="text-xs text-slate-500 mb-1">10 de Out, 2023 - 10:00</p>
                        <p className="text-sm text-slate-400">Definição de locação e moodboard aprovado.</p>
                      </div>

                      {/* Timeline Item 3 */}
                      <div className="relative">
                        <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-slate-600 ring-4 ring-slate-800"></div>
                        <p className="text-sm font-bold text-white">Cliente Criado</p>
                        <p className="text-xs text-slate-500 mb-1">{new Date(selectedClient.createdAt).toLocaleDateString('pt-BR')}</p>
                        <p className="text-sm text-slate-400">Lead cadastrado no sistema.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Actions & Next Steps */}
              <div className="space-y-6">
                 <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 text-sm uppercase text-slate-500">Ações Rápidas</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={handleOpenSchedule}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-left text-slate-200"
                      >
                        <Calendar className="w-4 h-4 text-indigo-400" /> Agendar Ensaio
                      </button>
                      <button 
                        onClick={handleSendEmail}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-left text-slate-200"
                      >
                        <Mail className="w-4 h-4 text-pink-400" /> Enviar Email
                      </button>
                      <button 
                        onClick={() => alert("Funcionalidade em desenvolvimento: Redirecionará para IA.")}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-left text-slate-200"
                      >
                        <MapPin className="w-4 h-4 text-green-400" /> Criar Roteiro
                      </button>
                    </div>
                 </div>

                 <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 p-5 rounded-xl border border-indigo-500/20">
                   <h3 className="font-bold text-indigo-100 mb-2">LTV do Cliente</h3>
                   <p className="text-3xl font-bold text-white mb-1">R$ 3.500</p>
                   <p className="text-xs text-indigo-200/60">Total gasto em serviços</p>
                 </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};