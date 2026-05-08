import React, { useState, useRef, useEffect, useCallback } from 'react';
import { chatAPI } from '../services/api';

// ==================== ICONS ====================
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MaximizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const MinimizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const ChatBubbleIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
    <circle cx="8" cy="10" r="1.2" /><circle cx="12" cy="10" r="1.2" /><circle cx="16" cy="10" r="1.2" />
  </svg>
);

const BotAvatar = ({ size = 32 }) => (
  <div style={{
    width: `${size}px`, height: `${size}px`, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(220,38,38,0.35)',
  }}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="white">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  </div>
);

// ==================== THEME COLORS (Red + Dark) ====================
const T = {
  red: '#dc2626',
  redDark: '#991b1b',
  redLight: '#ef4444',
  redGlow: 'rgba(220,38,38,0.4)',
  redGlowSoft: 'rgba(239,68,68,0.15)',
  bg: '#0a0a0a',
  card: '#141414',
  border: '#262626',
  borderLight: '#2a2a2a',
  text: '#e5e5e5',
  textMuted: '#737373',
  textDim: '#525252',
};

// ==================== MOBILE DETECTION HOOK ====================
const useIsMobile = (breakpoint = 480) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
};

// ==================== QUICK ACTIONS ====================
const GENERAL_QUICK_ACTIONS = [
  { label: '📋 What is ProcureHub?', message: 'What is ProcureHub and how does it work?' },
  { label: '💰 Pricing plans', message: 'What pricing plans are available?' },
  { label: '🚀 Get started', message: 'How do I get started with ProcureHub?' },
  { label: '🔒 Security info', message: 'How secure is my data on ProcureHub?' },
];

const TECHNICAL_QUICK_ACTIONS = [
  { label: '📄 PDF issues', message: 'My PDF is not extracting correctly. How can I fix it?' },
  { label: '🔐 Login problems', message: "I'm having trouble logging in. What should I check?" },
  { label: '🔗 API integration', message: 'How can I integrate ProcureHub with my existing systems?' },
  { label: '📊 Export help', message: 'How do I export quotation comparisons to Excel?' },
];

// ==================== WELCOME MESSAGES ====================
const GENERAL_WELCOME = {
  role: 'assistant',
  content: `Hello! 👋\n\nI'll do my best to help you with anything related to:\n\n📋 **ProcureHub features & how it works**\n💰 **Pricing plans & billing**\n🛒 **Buyer & vendor workflows**\n❓ **General questions about procurement**\n\nIf you have a technical question ⚙️ regarding the platform itself — switch to the **Technical Chat** tab.\n\nHow can I help you today?`
};

const TECHNICAL_WELCOME = {
  role: 'assistant',
  content: `Hello! ⚙️\n\nI'm your Technical Support AI. I can help with:\n\n📄 **PDF upload & extraction issues**\n🔐 **Authentication & login problems**\n🔗 **API integration & configuration**\n📊 **Analytics & export questions**\n🛠️ **Troubleshooting & debugging**\n\nFor general questions about features or pricing, switch to the **General Chat** tab.\n\nWhat technical issue can I help you with?`
};


// ==================== MAIN COMPONENT ====================
const ChatBot = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  const [generalMessages, setGeneralMessages] = useState([GENERAL_WELCOME]);
  const [technicalMessages, setTechnicalMessages] = useState([TECHNICAL_WELCOME]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const messages = activeTab === 'general' ? generalMessages : technicalMessages;

  // On mobile, chat always opens full screen
  const isFullScreen = isMobile || isMaximized;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [generalMessages, technicalMessages, isLoading]);

  // Focus input
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen, activeTab]);

  // Stop pulse on first open
  useEffect(() => { if (isOpen) setShowPulse(false); }, [isOpen]);

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, isOpen]);

  // Markdown formatter
  const fmt = useCallback((text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff;font-weight:600">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, `<code style="background:${T.redGlowSoft};padding:1px 6px;border-radius:4px;font-size:0.85em;color:${T.redLight}">$1</code>`)
      .replace(/\n/g, '<br/>');
  }, []);

  // Send message
  const send = async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || isLoading) return;

    const setter = activeTab === 'general' ? setGeneralMessages : setTechnicalMessages;
    const currentMsgs = activeTab === 'general' ? generalMessages : technicalMessages;

    setter(prev => [...prev, { role: 'user', content: trimmed }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = currentMsgs.slice(1).map(m => ({ role: m.role, content: m.content }));
      const res = await chatAPI.sendMessage(trimmed, activeTab, history);
      setter(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setter(prev => [...prev, {
        role: 'assistant', isError: true,
        content: err.response?.data?.detail || '⚠️ Something went wrong. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    (activeTab === 'general' ? setGeneralMessages : setTechnicalMessages)(
      [activeTab === 'general' ? GENERAL_WELCOME : TECHNICAL_WELCOME]
    );
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(inputValue); } };

  const qActions = activeTab === 'general' ? GENERAL_QUICK_ACTIONS : TECHNICAL_QUICK_ACTIONS;
  const showQA = messages.length <= 1;

  // ==================== BUTTON SIZES ====================
  const btnSize = isMobile ? 42 : 50;
  const btnBottom = isMobile ? 16 : 28;
  const btnRight = isMobile ? 16 : 28;

  return (
    <>
      {/* ====== FLOATING BUTTON ====== */}
      <button
        onClick={() => { setIsOpen(o => !o); setHasUnread(false); }}
        aria-label={isOpen ? 'Close chat' : 'Open AI Chat'}
        style={{
          position: 'fixed',
          bottom: `${btnBottom}px`,
          right: `${btnRight}px`,
          zIndex: 9998,
          height: `${btnSize}px`,
          width: isOpen ? `${btnSize}px` : (isMobile ? `${btnSize}px` : 'auto'),
          borderRadius: isOpen || isMobile ? '50%' : '25px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: (isOpen || isMobile) ? '0' : '10px',
          padding: (isOpen || isMobile) ? '0' : '0 20px',
          background: isOpen
            ? 'linear-gradient(135deg, #404040, #262626)'
            : `linear-gradient(135deg, ${T.redLight}, ${T.red}, ${T.redDark})`,
          color: '#fff',
          fontSize: isMobile ? '12px' : '14px',
          fontWeight: '700',
          fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
          letterSpacing: '0.3px',
          boxShadow: isOpen
            ? '0 4px 20px rgba(0,0,0,0.4)'
            : `0 4px 20px ${T.redGlow}`,
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          animation: showPulse && !isOpen ? 'phChatPulse 2s ease-in-out infinite' : 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? (
          <CloseIcon />
        ) : isMobile ? (
          <ChatBubbleIcon size={20} />
        ) : (
          <><span>AI Chat</span><ChatBubbleIcon size={20} /></>
        )}
        {hasUnread && !isOpen && (
          <span style={{
            position: 'absolute', top: '-3px', right: '-3px',
            width: '10px', height: '10px', borderRadius: '50%',
            background: '#22c55e', border: '2px solid #0a0a0a',
          }} />
        )}
      </button>

      {/* ====== CHAT WINDOW ====== */}
      <div style={{
        position: 'fixed',
        bottom: isFullScreen ? '0' : '90px',
        right: isFullScreen ? '0' : '28px',
        left: isFullScreen ? '0' : 'auto',
        top: isFullScreen ? '0' : 'auto',
        zIndex: 9999,
        width: isFullScreen ? '100%' : '400px',
        maxWidth: isFullScreen ? '100%' : '95vw',
        height: isFullScreen ? '100%' : '560px',
        maxHeight: isFullScreen ? '100%' : 'calc(100vh - 110px)',
        borderRadius: isFullScreen ? '0' : '16px',
        overflow: 'hidden',
        display: isOpen ? 'flex' : 'none',
        flexDirection: 'column',
        background: T.bg,
        boxShadow: isFullScreen ? 'none' : '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        border: isFullScreen ? 'none' : '1px solid rgba(255,255,255,0.06)',
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* ====== HEADER ====== */}
        <div style={{
          background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a, #111)',
          borderBottom: `1px solid ${T.red}30`,
          flexShrink: 0,
        }}>
          {/* Title row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: isMobile ? '12px 12px 8px 12px' : '14px 16px 10px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '12px' }}>
              <div style={{
                width: isMobile ? '32px' : '36px',
                height: isMobile ? '32px' : '36px',
                borderRadius: isMobile ? '8px' : '10px',
                background: `linear-gradient(135deg, ${T.red}25, ${T.redDark}40)`,
                border: `1px solid ${T.red}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width={isMobile ? 15 : 18} height={isMobile ? 15 : 18} viewBox="0 0 24 24" fill={T.redLight}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: '700', fontSize: isMobile ? '13px' : '14.5px', lineHeight: '1.2' }}>
                  ProcureHub AI
                </div>
                <div style={{ color: T.textMuted, fontSize: isMobile ? '10.5px' : '11.5px', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#22c55e', display: 'inline-block',
                    boxShadow: '0 0 6px rgba(34,197,94,0.5)',
                  }} />
                  Online
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { icon: <TrashIcon />, fn: clear, tip: 'Clear' },
                ...(!isMobile ? [{ icon: isMaximized ? <MinimizeIcon /> : <MaximizeIcon />, fn: () => setIsMaximized(v => !v), tip: isMaximized ? 'Minimize' : 'Maximize' }] : []),
                { icon: <CloseIcon />, fn: () => setIsOpen(false), tip: 'Close' },
              ].map((b, i) => (
                <button key={i} onClick={b.fn} title={b.tip} style={{
                  width: isMobile ? '30px' : '32px',
                  height: isMobile ? '30px' : '32px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.04)', color: '#a3a3a3',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s', fontSize: 0,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#a3a3a3'; }}
                >{b.icon}</button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', padding: isMobile ? '0 12px' : '0 16px' }}>
            {['general', 'technical'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: isMobile ? '9px 0' : '11px 0', border: 'none', cursor: 'pointer',
                background: 'transparent',
                color: activeTab === tab ? T.redLight : T.textMuted,
                fontSize: isMobile ? '11px' : '12px',
                fontWeight: activeTab === tab ? '700' : '500',
                fontFamily: 'inherit',
                borderBottom: activeTab === tab ? `2.5px solid ${T.red}` : '2.5px solid transparent',
                transition: 'all 0.2s', letterSpacing: '0.8px', textTransform: 'uppercase',
              }}>
                {tab === 'general' ? 'General Chat' : 'Technical Chat'}
              </button>
            ))}
          </div>
        </div>

        {/* ====== MESSAGES ====== */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: isMobile ? '12px' : '16px',
          background: T.bg, display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '14px',
        }}>
          {messages.map((msg, idx) => (
            <div key={`${activeTab}-${idx}`} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end', gap: isMobile ? '6px' : '8px',
              animation: idx === messages.length - 1 ? 'phMsgIn 0.3s ease-out' : 'none',
            }}>
              {msg.role === 'assistant' && <BotAvatar size={isMobile ? 28 : 32} />}
              <div style={{
                maxWidth: isMobile ? '85%' : '78%',
                padding: isMobile ? '9px 12px' : '11px 14px',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: msg.role === 'user'
                  ? `linear-gradient(135deg, ${T.red}, ${T.redDark})`
                  : msg.isError ? `${T.red}15` : T.card,
                color: msg.role === 'user' ? '#fff' : msg.isError ? T.redLight : T.text,
                fontSize: isMobile ? '12.5px' : '13.5px',
                lineHeight: '1.6', wordBreak: 'break-word',
                boxShadow: msg.role === 'user' ? `0 2px 10px ${T.redGlow}` : '0 1px 3px rgba(0,0,0,0.2)',
                border: msg.role === 'user' ? 'none' : msg.isError ? `1px solid ${T.red}30` : `1px solid ${T.border}`,
              }} dangerouslySetInnerHTML={{ __html: fmt(msg.content) }} />
            </div>
          ))}

          {/* Typing */}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: isMobile ? '6px' : '8px', animation: 'phMsgIn 0.3s ease-out' }}>
              <BotAvatar size={isMobile ? 28 : 32} />
              <div style={{
                padding: isMobile ? '12px 16px' : '14px 20px', borderRadius: '14px 14px 14px 4px',
                background: T.card, border: `1px solid ${T.border}`,
                display: 'flex', gap: '6px',
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: isMobile ? '6px' : '7px', height: isMobile ? '6px' : '7px',
                    borderRadius: '50%', background: T.red,
                    animation: 'phDot 1.2s ease-in-out infinite',
                    animationDelay: `${i * 0.15}s`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {showQA && !isLoading && (
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              gap: isMobile ? '5px' : '7px',
              marginTop: '4px', animation: 'phMsgIn 0.4s ease-out',
            }}>
              {qActions.map((a, i) => (
                <button key={i} onClick={() => send(a.message)} style={{
                  padding: isMobile ? '6px 10px' : '8px 14px',
                  borderRadius: '20px',
                  border: `1px solid ${T.borderLight}`, background: T.card,
                  color: T.text, fontSize: isMobile ? '11px' : '12px',
                  cursor: 'pointer', fontFamily: 'inherit', fontWeight: '500',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = T.red;
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = T.red;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${T.redGlow}`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = T.card;
                    e.currentTarget.style.color = T.text;
                    e.currentTarget.style.borderColor = T.borderLight;
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >{a.label}</button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ====== INPUT ====== */}
        <div style={{
          padding: isMobile ? '10px 12px' : '12px 16px',
          paddingBottom: isMobile ? 'max(10px, env(safe-area-inset-bottom))' : '12px',
          borderTop: `1px solid ${T.borderLight}`,
          background: T.bg, flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: '8px',
            background: T.card, borderRadius: '12px',
            padding: '4px 4px 4px 12px',
            border: `1px solid ${T.borderLight}`, transition: 'border-color 0.2s',
          }}
            onFocus={e => e.currentTarget.style.borderColor = T.red}
            onBlur={e => e.currentTarget.style.borderColor = T.borderLight}
          >
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={onKey}
              placeholder="Type message..."
              rows={1}
              disabled={isLoading}
              style={{
                flex: 1, border: 'none', outline: 'none', resize: 'none',
                background: 'transparent',
                fontSize: isMobile ? '14px' : '13.5px',
                lineHeight: '1.4',
                fontFamily: 'inherit', color: T.text,
                padding: '8px 0', maxHeight: '80px', minHeight: '20px',
                caretColor: T.red,
              }}
            />
            <button
              onClick={() => send(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              style={{
                width: isMobile ? '36px' : '38px',
                height: isMobile ? '36px' : '38px',
                borderRadius: '10px', border: 'none',
                cursor: inputValue.trim() && !isLoading ? 'pointer' : 'default',
                background: inputValue.trim() && !isLoading
                  ? `linear-gradient(135deg, ${T.redLight}, ${T.red})`
                  : '#2a2a2a',
                color: inputValue.trim() && !isLoading ? '#fff' : '#525252',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
                boxShadow: inputValue.trim() && !isLoading ? `0 2px 10px ${T.redGlow}` : 'none',
              }}
              onMouseEnter={e => { if (inputValue.trim() && !isLoading) e.currentTarget.style.transform = 'scale(1.08)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <SendIcon />
            </button>
          </div>

          <div style={{
            textAlign: 'center', marginTop: '6px',
            fontSize: isMobile ? '9.5px' : '10.5px',
            color: T.textDim, letterSpacing: '0.3px',
          }}>
            Powered by <span style={{ fontWeight: '600', color: T.red }}>ProcureHub AI</span> · OpenAI
          </div>
        </div>
      </div>

      {/* ====== ANIMATIONS ====== */}
      <style>{`
        @keyframes phChatPulse {
          0%,100% { box-shadow: 0 4px 24px ${T.redGlow}, 0 0 0 0 ${T.redGlow}; }
          50% { box-shadow: 0 4px 24px ${T.redGlow}, 0 0 0 14px rgba(220,38,38,0); }
        }
        @keyframes phMsgIn {
          from { opacity:0; transform:translateY(10px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes phDot {
          0%,60%,100% { transform:translateY(0); opacity:0.35; }
          30% { transform:translateY(-5px); opacity:1; }
        }
      `}</style>
    </>
  );
};

export default ChatBot;