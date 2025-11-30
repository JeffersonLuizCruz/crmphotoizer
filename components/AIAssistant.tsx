import React, { useState } from 'react';
import { generateCreativeConcept, generateClientEmail } from '../services/gemini';
import { AIConceptResponse } from '../types';
import { Sparkles, Lightbulb, Send, Copy, Loader2, Camera, Palette, Sun } from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concept' | 'email'>('concept');
  const [loading, setLoading] = useState(false);
  
  // Concept State
  const [conceptPrompt, setConceptPrompt] = useState('');
  const [conceptResult, setConceptResult] = useState<AIConceptResponse | null>(null);

  // Email State
  const [emailClient, setEmailClient] = useState('');
  const [emailScenario, setEmailScenario] = useState('');
  const [emailTone, setEmailTone] = useState('Profissional e amigável');
  const [emailResult, setEmailResult] = useState('');

  const handleGenerateConcept = async () => {
    if (!conceptPrompt) return;
    setLoading(true);
    try {
      const result = await generateCreativeConcept(conceptPrompt);
      setConceptResult(result);
    } catch (e) {
      alert("Erro ao gerar conceito. Verifique a API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!emailClient || !emailScenario) return;
    setLoading(true);
    try {
      const result = await generateClientEmail(emailClient, emailScenario, emailTone);
      setEmailResult(result);
    } catch (e) {
      alert("Erro ao gerar email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          IA Criativa <Sparkles className="text-indigo-400 w-6 h-6 animate-pulse" />
        </h2>
        
        <div className="bg-slate-800 p-1 rounded-lg flex border border-slate-700">
          <button 
            onClick={() => setActiveTab('concept')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'concept' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Conceitos de Ensaio
          </button>
          <button 
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'email' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Redator de Emails
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Input Panel */}
        <div className="w-1/3 bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col overflow-y-auto">
           {activeTab === 'concept' ? (
             <div className="space-y-4">
               <div className="flex items-center gap-2 mb-2">
                 <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400"><Camera className="w-5 h-5"/></div>
                 <h3 className="font-bold text-white">Novo Conceito</h3>
               </div>
               <p className="text-slate-400 text-sm">Descreva o cliente ou a ideia inicial e deixe a IA criar um moodboard completo.</p>
               
               <textarea 
                  className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-indigo-500"
                  placeholder="Ex: Ensaio gestante ao pôr do sol na praia, estilo boho, cliente tímida..."
                  value={conceptPrompt}
                  onChange={e => setConceptPrompt(e.target.value)}
               />
               
               <button 
                 onClick={handleGenerateConcept}
                 disabled={loading || !conceptPrompt}
                 className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
               >
                 {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                 Gerar Conceito
               </button>
             </div>
           ) : (
             <div className="space-y-4">
               <div className="flex items-center gap-2 mb-2">
                 <div className="bg-pink-500/20 p-2 rounded-lg text-pink-400"><Send className="w-5 h-5"/></div>
                 <h3 className="font-bold text-white">Rascunho de Email</h3>
               </div>
               
               <div>
                 <label className="text-xs text-slate-500 uppercase font-bold">Nome do Cliente</label>
                 <input 
                   type="text" 
                   className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white mt-1"
                   placeholder="Maria Silva"
                   value={emailClient}
                   onChange={e => setEmailClient(e.target.value)}
                 />
               </div>

               <div>
                 <label className="text-xs text-slate-500 uppercase font-bold">Cenário / Motivo</label>
                 <textarea 
                    className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white mt-1 resize-none"
                    placeholder="Ex: Agradecer pelo ensaio e avisar que as prévias estão prontas..."
                    value={emailScenario}
                    onChange={e => setEmailScenario(e.target.value)}
                 />
               </div>

               <div>
                 <label className="text-xs text-slate-500 uppercase font-bold">Tom de Voz</label>
                 <select 
                   className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white mt-1"
                   value={emailTone}
                   onChange={e => setEmailTone(e.target.value)}
                 >
                   <option>Profissional e amigável</option>
                   <option>Formal</option>
                   <option>Entusiasmado</option>
                   <option>Empático (para más notícias)</option>
                 </select>
               </div>

               <button 
                 onClick={handleGenerateEmail}
                 disabled={loading || !emailScenario}
                 className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
               >
                 {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                 Escrever Email
               </button>
             </div>
           )}
        </div>

        {/* Output Panel */}
        <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-700 p-8 overflow-y-auto shadow-inner relative">
           {!conceptResult && !emailResult && !loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 opacity-50">
               <Lightbulb className="w-16 h-16 mb-4" />
               <p className="text-lg">Os resultados aparecerão aqui.</p>
             </div>
           )}

           {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-400">
               <Loader2 className="w-12 h-12 animate-spin mb-4" />
               <p>Consultando a IA...</p>
             </div>
           )}

           {activeTab === 'concept' && conceptResult && !loading && (
             <div className="space-y-8 animate-fade-in">
                <div className="border-b border-slate-700 pb-6">
                  <h2 className="text-3xl font-serif italic text-white mb-2">{conceptResult.title}</h2>
                  <div className="flex gap-3">
                     <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm border border-indigo-500/30">Mood: {conceptResult.mood}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                     <h4 className="flex items-center gap-2 text-yellow-400 font-bold mb-3"><Sun className="w-5 h-5"/> Iluminação</h4>
                     <p className="text-slate-300 leading-relaxed">{conceptResult.lighting}</p>
                  </div>
                  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                     <h4 className="flex items-center gap-2 text-pink-400 font-bold mb-3"><Palette className="w-5 h-5"/> Looks Sugeridos</h4>
                     <ul className="list-disc list-inside space-y-2 text-slate-300">
                       {conceptResult.outfitSuggestions.map((item, idx) => (
                         <li key={idx}>{item}</li>
                       ))}
                     </ul>
                  </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-4"><Camera className="w-5 h-5"/> Ideias de Poses</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {conceptResult.poseIdeas.map((idea, idx) => (
                      <div key={idx} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                        <p className="text-slate-300 italic">"{idea}"</p>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
           )}

           {activeTab === 'email' && emailResult && !loading && (
             <div className="animate-fade-in h-full flex flex-col">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-white">Rascunho Gerado</h3>
                 <button 
                  onClick={() => navigator.clipboard.writeText(emailResult)}
                  className="text-indigo-400 hover:text-white flex items-center gap-2 text-sm"
                 >
                   <Copy className="w-4 h-4" /> Copiar Texto
                 </button>
               </div>
               <div className="flex-1 bg-white text-slate-900 p-6 rounded-xl font-sans whitespace-pre-wrap leading-relaxed shadow-lg overflow-y-auto">
                 {emailResult}
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
