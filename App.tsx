import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, MessageRole, ChatSession, ModelConfig, AppView } from './types';
import { sendMessageStream, generateChatTitle } from './services/geminiService';
import { PROMPT_SUGGESTIONS, SendIcon, UserIcon, BotIcon, DEFAULT_MODEL_CONFIG, PlusIcon, SettingsIcon, MessageSquareIcon, MenuIcon, XIcon, TrashIcon } from './constants';
import useLocalStorage from './useLocalStorage';

// --- Reusable Components ---

const AnimatedTextSegment: React.FC<{ text: string }> = ({ text }) => {
    const prevTextRef = useRef("");
    useEffect(() => { prevTextRef.current = text; });
    const oldTextContent = text.startsWith(prevTextRef.current) ? prevTextRef.current : "";
    const newTextContent = text.startsWith(prevTextRef.current) ? text.substring(prevTextRef.current.length) : text;
    const renderWithBold = (content: string) => content.split(/(\*\*.*?\*\*)/g).map((segment, i) =>
        segment.startsWith('**') && segment.endsWith('**') ? <strong key={i}>{segment.slice(2, -2)}</strong> : <span key={i}>{segment}</span>
    );
    return <>{renderWithBold(oldTextContent)}{newTextContent && <span className="animate-fade-in-up">{renderWithBold(newTextContent)}</span>}</>;
};

const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
    const parts = content.split(/(```[\s\S]*?```)/g).filter(Boolean);
    return (
        <div className="whitespace-pre-wrap">
            {parts.map((part, index) => {
                if (part.startsWith('```')) {
                    const langMatch = part.match(/^```(\w+)?\n/);
                    const language = langMatch ? langMatch[1] : '';
                    const code = part.slice(langMatch ? langMatch[0].length : 3, -3);
                    return (
                        <div key={index} className="bg-gray-900/70 rounded-lg my-4 overflow-hidden">
                            <div className="flex justify-between items-center px-4 py-1.5 bg-gray-800/50">
                                <span className="text-xs text-gray-400 font-sans">{language}</span>
                                <button onClick={() => navigator.clipboard.writeText(code)} className="text-xs text-gray-400 hover:text-white transition-colors">Copy</button>
                            </div>
                            <pre className="p-4 text-sm overflow-x-auto"><code>{code}</code></pre>
                        </div>
                    );
                }
                return <AnimatedTextSegment key={index} text={part} />;
            })}
        </div>
    );
};

const LoadingIndicator: React.FC = () => (
    <div className="relative flex h-6 w-6 items-center justify-center">
        <div className="absolute h-5 w-5 rounded-full border-2 border-solid border-gray-500/50"></div>
        <div className="absolute h-5 w-5 animate-[orbit_1.2s_linear_infinite] rounded-full border-2 border-solid border-indigo-400 border-t-transparent"></div>
    </div>
);

const Message: React.FC<{ message: ChatMessage, isLoading: boolean }> = ({ message, isLoading }) => {
    const isModel = message.role === MessageRole.MODEL;
    const showLoading = isModel && isLoading && message.content === '';
    return (
        <div className="flex items-start gap-4 animate-fade-in">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isModel ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-700/50 text-gray-400'}`}>
                {isModel ? <BotIcon /> : <UserIcon />}
            </div>
            <div className="flex-1 pt-0.5">
                <p className={`font-semibold mb-2 ${isModel ? 'text-indigo-400' : 'text-gray-200'}`}>
                    {isModel ? 'Gemini' : 'You'}
                </p>
                <div className="text-gray-300 leading-7">{showLoading ? <LoadingIndicator /> : <MarkdownContent content={message.content} />}</div>
            </div>
        </div>
    );
};

// --- Main App Views & Components ---

const Sidebar: React.FC<{
    chats: ChatSession[];
    activeChatId: string | null;
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
    onSetView: (view: AppView) => void;
    onClose: () => void;
}> = ({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, onSetView, onClose }) => (
    <div className="sidebar bg-gray-900/80 border-r border-gray-700/50 flex flex-col p-2">
        <div className="flex justify-between items-start px-3 pt-2 pb-4">
            <h1 className="text-xl font-bold text-gray-200">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Gemini
                </span> Copilot
            </h1>
            <button onClick={onClose} className="p-1 -mr-1 rounded-full text-gray-400 hover:bg-gray-700/50 md:hidden">
                <XIcon />
            </button>
        </div>
        <button onClick={onNewChat} className="relative overflow-hidden flex items-center justify-center gap-2 w-full p-2.5 mb-4 text-sm font-semibold text-gray-200 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors duration-200 shiny-button">
            <PlusIcon /> New Chat
        </button>
        <div className="flex-1 overflow-y-auto pr-1 space-y-1">
            {chats.filter(c => c.messages.length > 0).map(chat => (
                <div key={chat.id} className="group relative">
                    <button
                        onClick={() => onSelectChat(chat.id)}
                        className={`flex items-center gap-3 w-full text-left pl-3 pr-8 py-2 text-sm rounded-md transition-colors ${activeChatId === chat.id ? 'bg-gray-700/60 text-white' : 'text-gray-400 hover:bg-gray-700/40 hover:text-gray-200'}`}
                    >
                        <MessageSquareIcon />
                        <span className="flex-1 truncate">{chat.title}</span>
                    </button>
                     <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-600/50 transition-all"
                        aria-label={`Delete chat: ${chat.title}`}
                    >
                        <TrashIcon />
                    </button>
                </div>
            ))}
        </div>
        <div className="pt-2 border-t border-gray-700/50">
            <button onClick={() => onSetView('settings')} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-700/40 hover:text-gray-200 rounded-md transition-colors">
                <SettingsIcon /> Settings
            </button>
        </div>
    </div>
);

const ChatView: React.FC<{ messages: ChatMessage[], isLoading: boolean }> = ({ messages, isLoading }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, messages[messages.length - 1]?.content]);
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
            {messages.map((msg, index) => <Message key={msg.id} message={msg} isLoading={isLoading && index === messages.length - 1} />)}
            <div ref={scrollRef} />
        </div>
    );
};

const ChatInput: React.FC<{ onSend: (prompt: string) => void; isLoading: boolean; }> = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [input]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) { onSend(input); setInput(''); }
    };
    return (
        <div className="px-4 md:px-6 pb-4 md:pb-6 mt-auto">
            <div className="bg-gray-800/50 border border-gray-700/80 rounded-2xl p-2 flex items-end w-full backdrop-blur-sm shadow-lg focus-within:ring-2 focus-within:ring-indigo-500/80 transition-shadow">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                    placeholder="Got a coding question? Drop it here..."
                    rows={1}
                    className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none resize-none p-2 max-h-48"
                    disabled={isLoading}
                />
                <button type="submit" onClick={handleSubmit} disabled={isLoading || !input.trim()} className="w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-xl text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-500 transition-all duration-200 transform hover:scale-105 active:scale-95">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <SendIcon />}
                </button>
            </div>
        </div>
    );
};

const PromptSuggestionCard: React.FC<{ icon: React.ReactNode; title: string; prompt: string; onClick: (prompt: string) => void }> = ({ icon, title, prompt, onClick }) => (
    <div className="relative group w-full animate-fade-in">
        <div className="absolute -inset-px bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-sm opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
        <button onClick={() => onClick(prompt)} className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/60 rounded-xl p-4 text-left w-full h-full transition-all duration-200 group-hover:bg-gray-800">
            <div className="flex items-center gap-4">
                <div className="text-indigo-400">{icon}</div>
                <h3 className="text-gray-200 font-semibold">{title}</h3>
            </div>
        </button>
    </div>
);

const WelcomeScreen: React.FC<{ onSuggestionClick: (prompt: string) => void }> = ({ onSuggestionClick }) => {
    const words = ["Sup,", "I'm"];
    return (
    <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="text-center">
             <h1 className="text-4xl md:text-5xl font-bold text-gray-200">
                {words.map((word, i) => (
                    <span key={i} className="reveal-container">
                        <span className="reveal-item" style={{ animationDelay: `${i * 0.1}s` }}>{word}&nbsp;</span>
                    </span>
                ))}
                 <span className="reveal-container">
                    <span className="reveal-item bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" style={{ animationDelay: `${words.length * 0.1}s` }}>Gemini</span>
                </span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-400 max-w-xl mx-auto animate-fade-in" style={{animationDelay: '0.3s'}}>Your go-to for coding, debugging, or just brainstorming what's next. Let's build something cool.</p>
        </div>
        <div className="mt-12 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROMPT_SUGGESTIONS.map((suggestion, index) => (
              <div key={index} style={{ animationDelay: `${0.4 + index * 0.1}s`}} className="animate-fade-in">
                <PromptSuggestionCard {...suggestion} onClick={onSuggestionClick} />
              </div>
            ))}
        </div>
    </div>
    );
};

const SettingsPage: React.FC<{
    settings: ModelConfig;
    onSettingsChange: (newSettings: ModelConfig) => void;
    onClose: () => void;
}> = ({ settings, onSettingsChange, onClose }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const handleSave = () => { onSettingsChange(localSettings); onClose(); };
    const handleReset = () => setLocalSettings(DEFAULT_MODEL_CONFIG);
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setLocalSettings(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    return (
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto w-full animate-fade-in">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400 mb-8">Customize the AI's behavior for all new chats.</p>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="systemInstruction" className="block text-sm font-medium text-gray-300 mb-2">System Instruction</label>
                        <textarea id="systemInstruction" name="systemInstruction" value={localSettings.systemInstruction} onChange={handleInputChange} rows={6} className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
                    </div>
                    <div>
                        <label htmlFor="temperature" className="block text-sm font-medium text-gray-300 mb-2">Temperature: <span className="text-indigo-400 font-mono">{localSettings.temperature.toFixed(2)}</span></label>
                        <input id="temperature" name="temperature" type="range" min="0" max="1" step="0.01" value={localSettings.temperature} onChange={handleInputChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="topP" className="block text-sm font-medium text-gray-300 mb-2">Top-P: <span className="text-indigo-400 font-mono">{localSettings.topP.toFixed(2)}</span></label>
                        <input id="topP" name="topP" type="range" min="0" max="1" step="0.01" value={localSettings.topP} onChange={handleInputChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="topK" className="block text-sm font-medium text-gray-300 mb-2">Top-K: <span className="text-indigo-400 font-mono">{localSettings.topK}</span></label>
                        <input id="topK" name="topK" type="range" min="1" max="100" step="1" value={localSettings.topK} onChange={handleInputChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 mt-10 pt-6 border-t border-gray-700/50">
                    <button onClick={handleReset} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors">Reset to Defaults</button>
                    <button onClick={handleSave} className="px-6 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors">Save & Close</button>
                </div>
            </div>
        </div>
    );
};

const ConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-container animate-modal-in">
                <h2 id="modal-title" className="text-xl font-bold text-white mb-2">{title}</h2>
                <p className="text-gray-400 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function App() {
    const [settings, setSettings] = useLocalStorage<ModelConfig>('gemini-copilot-settings', DEFAULT_MODEL_CONFIG);
    const [chats, setChats] = useLocalStorage<ChatSession[]>('gemini-copilot-chats', []);
    const [activeChatId, setActiveChatId] = useLocalStorage<string | null>('gemini-copilot-active-chat', null);
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState<AppView>('chat');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<string | null>(null);

    const activeChat = chats.find(c => c.id === activeChatId);

    const createNewChat = useCallback(() => {
        const newChat: ChatSession = { id: `chat-${Date.now()}`, title: 'New Chat', messages: [], config: settings };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setView('chat');
    }, [settings, setChats, setActiveChatId]);
    
    useEffect(() => {
        if (activeChatId === null && chats.length > 0) {
            setActiveChatId(chats[0].id);
        } else if (activeChatId !== null && !chats.find(c => c.id === activeChatId)) {
            setActiveChatId(chats.length > 0 ? chats[0].id : null);
        }
    }, [chats, activeChatId, setActiveChatId]);

    const handleSend = useCallback(async (prompt: string) => {
        let currentChatId = activeChatId;
        let chatToUpdate = activeChat;

        if (!chatToUpdate) {
            const newChat: ChatSession = { id: `chat-${Date.now()}`, title: 'New Chat', messages: [], config: settings };
            setChats(prev => [newChat, ...prev]);
            setActiveChatId(newChat.id);
            currentChatId = newChat.id;
            chatToUpdate = newChat;
            setView('chat');
        }

        const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: MessageRole.USER, content: prompt };
        const modelMessage: ChatMessage = { id: `model-${Date.now()}`, role: MessageRole.MODEL, content: '' };
        
        const initialHistory = chatToUpdate.messages;
        const updatedMessages = [...initialHistory, userMessage, modelMessage];
        
        setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, messages: updatedMessages } : c));
        setIsLoading(true);

        if (initialHistory.length === 0) {
            const title = await generateChatTitle(prompt);
            setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, title } : c));
        }

        await sendMessageStream(prompt, initialHistory, settings, (chunk) => {
            setChats(prev => prev.map(chat => {
                if (chat.id === currentChatId) {
                    const newMessages = [...chat.messages];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.id === modelMessage.id) {
                        lastMessage.content += chunk;
                    }
                    return { ...chat, messages: newMessages };
                }
                return chat;
            }));
        });
        setIsLoading(false);
    }, [activeChat, activeChatId, settings, setChats, setActiveChatId]);

    const handleNewChat = () => {
        createNewChat();
        setIsSidebarOpen(false);
    };
    const handleSelectChat = (id: string) => {
        setActiveChatId(id);
        setView('chat');
        setIsSidebarOpen(false);
    };
    const handleInitiateDelete = (id: string) => {
        setChatToDelete(id);
    };
    const handleConfirmDelete = () => {
        if (!chatToDelete) return;

        const updatedChats = chats.filter(c => c.id !== chatToDelete);
        setChats(updatedChats);

        if (activeChatId === chatToDelete) {
            const nextChat = updatedChats.length > 0 ? updatedChats[0] : null;
            setActiveChatId(nextChat ? nextChat.id : null);
        }
        
        setChatToDelete(null);
    };
    const handleCancelDelete = () => {
        setChatToDelete(null);
    };
    const handleSetView = (view: AppView) => {
        setView(view);
        setIsSidebarOpen(false);
    }

    return (
        <div className={`h-screen w-screen bg-gray-950 text-white flex overflow-hidden ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className="sidebar-overlay md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
            <Sidebar 
                chats={chats} 
                activeChatId={activeChatId} 
                onNewChat={handleNewChat} 
                onSelectChat={handleSelectChat}
                onDeleteChat={handleInitiateDelete}
                onSetView={handleSetView}
                onClose={() => setIsSidebarOpen(false)}
            />
            <main className="flex-1 flex flex-col min-h-0 bg-gray-950/50">
                <div className="mobile-header flex-shrink-0 flex items-center justify-between p-2 border-b border-gray-800/80 md:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-800">
                        <MenuIcon />
                    </button>
                    <h2 className="font-semibold text-gray-300 truncate">
                        {view === 'settings' ? 'Settings' : (activeChat?.title || 'New Chat')}
                    </h2>
                    <div className="w-10"></div> 
                </div>

                {view === 'settings' ? (
                    <SettingsPage settings={settings} onSettingsChange={setSettings} onClose={() => setView('chat')} />
                ) : (
                    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0">
                        {(!activeChatId || !activeChat || activeChat.messages.length === 0) ? (
                            <WelcomeScreen onSuggestionClick={handleSend} />
                        ) : (
                            <ChatView messages={activeChat.messages} isLoading={isLoading} />
                        )}
                        <div className="w-full">
                            <ChatInput onSend={handleSend} isLoading={isLoading} />
                        </div>
                    </div>
                )}
            </main>
             <ConfirmationModal
                isOpen={!!chatToDelete}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Chat"
                message={`Are you sure you want to permanently delete this chat? This action cannot be undone.`}
            />
        </div>
    );
}