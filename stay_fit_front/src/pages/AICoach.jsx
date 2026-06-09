import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWellness } from '../context/WellnessContext';
import { runIntelligencePipeline } from '../services/aiPipeline';

const AICoach = () => {
  const { metrics, readiness, metricsHistory } = useWellness();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: `STATE:\nSystem initialized.\n\nPHYSICAL:\nStanding by for biometric analysis.\n\nMENTAL:\nReady to assist.\n\nMOTIVATION:\nLet's optimize your day.`,
      metrics: {
        score: readiness,
        hrv: '-12ms'
      }
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = inputVal;
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userMsg }]);
    setInputVal('');
    setIsTyping(true);

    const pipelineResult = await runIntelligencePipeline(metrics, metricsHistory, userMsg);
    
    // Parse the structured text from LLM response
    const formattedHtml = pipelineResult.aiCoachResponse.replace(/\n/g, '<br/>');

    setMessages(prev => [...prev, { 
      id: Date.now() + 1, 
      type: 'ai', 
      text: formattedHtml,
      metrics: {
        score: pipelineResult.recoveryScore,
        hrv: '-12ms' // Mocked HRV for now
      }
    }]);
    setIsTyping(false);
  };

  const handleSuggestion = (text) => {
    setInputVal(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-[calc(100vh-14rem)]" // Adjust height based on headers/footers
    >
      {/* Background Atmospheric Effect */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center overflow-hidden glow-pulse bg-surface-container-low">
            <img alt="AI Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0O5C2h7-NelI4MbsQKWrBFMp_Xv2YhyIbrbZvnA4MQpWKBAGJOHSBpe9AxjWwUBrnwqaq0KzJ63Vu4EKL6H_AGVoQwzSihiwGHEXs7oZp8T3WZknx7v_pb57qk0kuZj-LC6a-gHVS_knmNLCne8IK2W6TXvRw6uyblrFwnIHMs10OI8Tn0eVvAWlG3neqvT7Bx2ZPfn3H2Hz7YQWsDNJxSUI6weGdPeh3LlN0RhdU2kjEMhhFUfS9LKOKCR6liT8M415HrFPb_kkQ" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-tertiary-fixed-dim rounded-full border-2 border-surface"></div>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">Neural Assistant</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant/70 -mt-1">Online & Analyzing Biometrics</p>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide pb-4">
        {/* System Timestamp */}
        <div className="flex justify-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant/40 px-3 py-1 glass-card rounded-full uppercase tracking-widest">Today • 09:42 AM</span>
        </div>

        {messages.map(msg => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex ${msg.type === 'user' ? 'justify-end pl-12' : 'justify-start pr-12'} items-start gap-3`}
          >
            <div className={`px-5 py-4 rounded-2xl shadow-lg relative ${msg.type === 'user' ? 'bg-primary/10 border-r-4 border-r-primary-fixed-dim border-t border-t-primary/20 rounded-tr-none' : 'bg-white/5 border-l-4 border-l-primary-fixed-dim border-t border-t-white/10 rounded-tl-none backdrop-blur-xl'}`}>
              {msg.type === 'ai' && (
                <div className="flex items-center gap-2 mb-2 text-primary-fixed-dim">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Analysis Complete</span>
                </div>
              )}
              <p className="font-body-md text-body-md text-on-surface" dangerouslySetInnerHTML={{ __html: msg.text }}></p>
              
              {msg.metrics && (
                <div className="mt-4 p-3 bg-surface-container-low/50 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-error-container rounded-full relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-error h-2/3 shadow-[0_0_8px_#ffb4ab]" style={{ height: `${msg.metrics.score}%`, backgroundColor: msg.metrics.score > 70 ? '#00dbe7' : '#ffb4ab' }}></div>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Recovery Score</p>
                      <p className={`font-headline-md text-headline-md leading-tight ${msg.metrics.score > 70 ? 'text-primary-fixed-dim' : 'text-error'}`}>{msg.metrics.score}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">HRV Trend</p>
                    <p className="font-headline-md text-headline-md text-on-surface leading-tight">{msg.metrics.hrv}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start items-center gap-2 pl-4 pt-2">
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Shell */}
      <div className="mt-auto pt-4 space-y-3 relative z-10 bg-background/80 backdrop-blur-md pb-4">
        {/* Suggestion Chips */}
        <div className="w-full flex gap-2 overflow-x-auto scrollbar-hide">
          <button onClick={() => handleSuggestion('Why am I tired?')} className="flex-shrink-0 px-4 py-2 rounded-full glass-card border border-primary/20 flex items-center gap-2 hover:bg-primary/10 group active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">help</span>
            <span className="font-label-md text-label-md text-on-surface">Why am I tired?</span>
          </button>
          <button onClick={() => handleSuggestion('Should I work out today?')} className="flex-shrink-0 px-4 py-2 rounded-full glass-card border border-primary/20 flex items-center gap-2 hover:bg-primary/10 group active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">fitness_center</span>
            <span className="font-label-md text-label-md text-on-surface">Should I work out today?</span>
          </button>
          <button onClick={() => handleSuggestion('Fix my recovery')} className="flex-shrink-0 px-4 py-2 rounded-full glass-card border border-primary/20 flex items-center gap-2 hover:bg-primary/10 group active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">healing</span>
            <span className="font-label-md text-label-md text-on-surface">Fix my recovery</span>
          </button>
          <button onClick={() => handleSuggestion('Explain my score')} className="flex-shrink-0 px-4 py-2 rounded-full glass-card border border-primary/20 flex items-center gap-2 hover:bg-primary/10 group active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">analytics</span>
            <span className="font-label-md text-label-md text-on-surface">Explain my score</span>
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="w-full flex items-center gap-3 bg-surface-container-highest/50 rounded-full px-5 py-3 border border-white/10">
          <input 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 font-body-md text-body-md outline-none" 
            placeholder="Tell the coach how you feel..." 
            type="text"
          />
          <button 
            type="button"
            onClick={() => setIsListening(!isListening)}
            className={`w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary-fixed-dim hover:bg-primary/20 transition-all active:scale-90 ${isListening ? 'bg-primary/30 scale-110' : 'bg-primary/10'}`}
          >
            {isListening ? (
              <div className="voice-wave flex items-end h-5">
                <span style={{ animationDelay: '0.1s' }}></span>
                <span style={{ animationDelay: '0.3s' }}></span>
                <span style={{ animationDelay: '0.2s' }}></span>
                <span style={{ animationDelay: '0.4s' }}></span>
                <span style={{ animationDelay: '0.1s' }}></span>
              </div>
            ) : (
              <span className="material-symbols-outlined">mic</span>
            )}
          </button>
          <button type="submit" className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_0_15px_rgba(0,219,231,0.4)] hover:shadow-[0_0_25px_rgba(0,219,231,0.6)] transition-shadow">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AICoach;
