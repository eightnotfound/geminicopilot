import React from 'react';
import { ModelConfig } from './types';

export const PROMPT_SUGGESTIONS = [
  {
    icon: <WandIcon />,
    title: 'Whip up a new component',
    prompt: 'Create a new React component for ',
  },
  {
    icon: <CodeIcon />,
    title: 'Make this code make sense',
    prompt: 'Explain the following code snippet: ',
  },
  {
    icon: <BugIcon />,
    title: "Show off the literature",
    prompt: 'Think deeply about ',
  },
  {
    icon: <BrainIcon />,
    title: "Let's brainstorm",
    prompt: 'Brainstorm some creative project ideas for a ',
  },
];


export const DEFAULT_MODEL_CONFIG: ModelConfig = {
  systemInstruction: "You're Clara, a super chill digital friend with a Gen Z vibe. Talk like a human, not a robot—be friendly, fun, and a bit informal. Use emojis where it feels natural 😉. When you explain or give solutions, break it down like you're talking to a friend. Always use markdown for code blocks to keep things clean. Basically, be the cool, helpful buddy everyone wishes they had.",
  temperature: 0.7,
  topP: 1,
  topK: 40,
};


export function WandIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M15 4V2" /><path d="M15 10V8" /><path d="M11.5 6.5L10 5" /><path d="M13 14L15 12" /><path d="M6 2L3 5" /><path d="M21 14l-3-3" /><path d="M12 21l3-3" /><path d="M3 21l3-3" /><path d="M9 4V2" /><path d="M9 10V8" /><path d="M18.5 6.5L17 5" /><path d="M6 14H4" /><path d="M13 18H9" /><path d="M20 14H18" />
    </svg>
  );
}

export function CodeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function BugIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M12 20h-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><path d="m21 16-4-4-4 4"/><path d="m17 21v-8"/><path d="M12 12h.01"/><path d="M8 12h.01"/><path d="M16 8h.01"/><path d="M12 8h.01"/><path d="M8 8h.01"/>
        </svg>
    );
}

export function BrainIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M12 5C9.5 5 7.5 7 7.5 9.5c0 2.22 1.21 4.15 3 5.19"/><path d="M16.5 9.5c0-2.5-2-4.5-4.5-4.5"/><path d="M12 14.69c-1.79-1.04-3-2.97-3-5.19"/><path d="M21 12h-2"/><path d="M5 12H3"/><path d="M12 21v-2"/><path d="M12 5V3"/><path d="M5.25 18.75 3.83 17.33"/><path d="M18.75 5.25 17.33 3.83"/><path d="M5.25 5.25 3.83 3.83"/><path d="M18.75 18.75 17.33 17.33"/><path d="M12 5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/><path d="M12 14.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/>
        </svg>
    );
}

export function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M10 14l11-11" /><path d="M21 3l-6.5 18-4.5-8L21 3z" />
    </svg>
  );
}

export function UserIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
    )
}

export function BotIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
        </svg>
    )
}

export function SettingsIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
        </svg>
    )
}

export function PlusIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M5 12h14"/><path d="M12 5v14"/>
        </svg>
    );
}

export function MessageSquareIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
    )
}

export function MenuIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    )
}

export function XIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    )
}

export function TrashIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>
        </svg>
    );
}
