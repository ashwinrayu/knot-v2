import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Send, Paperclip, MessageSquare, ShieldCheck, MailOpen, User } from 'lucide-react';

export const StudentMessages: React.FC = () => {
  const { user } = useAuth();
  const { messages, sendMessage } = useAppState();

  const [activeThread, setActiveThread] = useState<'admissions' | 'system'>('admissions');
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages based on thread category
  const filteredMessages = messages.filter(msg => {
    if (activeThread === 'system') {
      return msg.senderRole === 'system';
    }
    return msg.senderRole === 'staff' || msg.senderRole === 'student';
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachment) return;

    const attachmentPayload = attachment 
      ? [{ name: attachment.name, url: '#' }] 
      : undefined;

    sendMessage(inputText, attachmentPayload, 'student');
    setInputText('');
    setAttachment(null);
  };

  const handleAttachClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      if (e.target.files?.[0]) {
        setAttachment(e.target.files[0]);
      }
    };
    input.click();
  };

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeThread]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch min-h-[70vh] font-sans text-xs">
      
      {/* Thread Listings Panel */}
      <Card className="lg:col-span-1 p-4 space-y-4 select-none flex flex-col justify-start">
        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block border-b pb-2">Conversation Channels</span>
        
        <div className="space-y-1.5">
          <button
            onClick={() => setActiveThread('admissions')}
            className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${
              activeThread === 'admissions' 
                ? 'bg-indigo-50 border border-indigo-100 text-indigo-750 font-bold' 
                : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <MessageSquare className="h-4.5 w-4.5 text-indigo-550 flex-shrink-0" />
            <div className="truncate font-semibold text-xs">
              <span className="block truncate">Admissions Advisor</span>
              <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Evelyn Martinez thread</span>
            </div>
          </button>

          <button
            onClick={() => setActiveThread('system')}
            className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${
              activeThread === 'system' 
                ? 'bg-indigo-50 border border-indigo-100 text-indigo-750 font-bold' 
                : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <ShieldCheck className="h-4.5 w-4.5 text-indigo-550 flex-shrink-0" />
            <div className="truncate font-semibold text-xs">
              <span className="block truncate">System Alerts</span>
              <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Automated extraction notifications</span>
            </div>
          </button>
        </div>
      </Card>

      {/* Main Conversation Window */}
      <Card className="lg:col-span-3 flex flex-col justify-between overflow-hidden relative">
        
        {/* Chat Header */}
        <div className="p-4 border-b select-none flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-8.5 w-8.5 rounded-full bg-indigo-55/10 border flex items-center justify-center text-indigo-650 font-bold">
              {activeThread === 'admissions' ? 'EM' : 'SYS'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs block capitalize">{activeThread} Channel</h3>
              <span className="text-[9px] text-slate-400 block font-semibold mt-0.5">
                {activeThread === 'admissions' ? 'Discussing credit evaluations' : 'System status monitors'}
              </span>
            </div>
          </div>
        </div>

        {/* Message Logs Area */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4 max-h-[50vh] bg-slate-50/20 font-semibold text-xs">
          {filteredMessages.map((msg) => {
            const isMe = msg.senderRole === 'student';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[75%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {!isMe && (
                  <div className="h-7 w-7 rounded-full bg-slate-100 border flex items-center justify-center text-slate-500 flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <div>
                  <div className={`p-3 rounded-2xl leading-normal text-xs ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white border text-slate-700 rounded-tl-none shadow-xs'
                  }`}>
                    <p className="font-medium">{msg.text}</p>
                    {msg.attachments && (
                      <div className="mt-2 pt-2 border-t border-slate-100/20 flex gap-2">
                        {msg.attachments.map((fileNode, fi) => (
                          <span key={fi} className="inline-flex items-center gap-1 text-[9px] bg-slate-800/10 hover:bg-slate-800/20 p-1.5 rounded font-mono">
                            <Paperclip className="h-3 w-3" />
                            {fileNode.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] text-slate-400 mt-1 block font-semibold text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input box */}
        {activeThread === 'admissions' ? (
          <form onSubmit={handleSend} className="p-4 border-t flex items-center gap-3 bg-white">
            <button 
              type="button" 
              onClick={handleAttachClick}
              className="p-2 border rounded-xl hover:bg-slate-50 text-slate-450 hover:text-slate-750 transition-colors shadow-xs"
              title="Attach Syllabus file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send message to admissions advisor Evelyn..."
              className="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 bg-slate-50/50 hover:bg-white transition-all"
            />

            {attachment && (
              <span className="text-[9px] bg-indigo-50 text-indigo-700 border px-2 py-1 rounded font-mono truncate max-w-28 flex items-center gap-1 font-bold">
                {attachment.name}
              </span>
            )}

            <Button type="submit" className="p-2.5 rounded-xl">
              <Send className="h-4.5 w-4.5" />
            </Button>
          </form>
        ) : (
          <div className="p-4 border-t text-center text-[10px] text-slate-400 bg-slate-50 font-bold select-none uppercase tracking-wider">
            Alert messages thread is read-only.
          </div>
        )}

      </Card>

    </div>
  );
};
export { StudentMessages as default };
