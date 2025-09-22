"use client";

import React, {useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage, Language } from "@/contexts/language-context";

// New UI Components
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatHistorySidebar } from "@/app/chatbot/ChatHistorySidebar";

// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Send, Bot, User, Paperclip, Mic, X, LoaderCircle, Sparkles, Languages, Menu } from "lucide-react"; // Removed ArrowLeft
import { cn } from "@/lib/utils";

// ---------- CONFIG & TYPES ----------
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

type Message = {
  role: "user" | "bot";
  text: string;
  html?: string;
  image?: string;
  suggestions?: string[];
};

type Chat = {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
};
type ChatHistory = {
  [id:string]: Chat;
};

// Declare SpeechRecognition types for window object
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

// ---------- HELPER FUNCTIONS ----------
const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve((reader.result as string).split(",")[1]); reader.onerror = reject; });
const mdToHtml = (md: string): string => md.replace(/^## (.*$)/gim, "<h2 class='font-bold text-lg mt-4 mb-2 text-foreground'>$1</h2>").replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold text-foreground'>$1</strong>").replace(/^[\*\-] (.*$)/gim, "<li class='ml-4 my-1 list-disc'>$1</li>").replace(/\n/g, "<br />");

// ---------- HELPER COMPONENTS ----------
function Speaker({ text, lang }: { text: string; lang: string }) { const [speaking, setSpeaking] = useState(false); useEffect(() => () => speechSynthesis.cancel(), []); const toggle = () => { if (speaking) { speechSynthesis.cancel(); setSpeaking(false); } else { const u = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, "")); const voices = speechSynthesis.getVoices(); const voice = voices.find((v) => v.lang.startsWith(lang)) || voices.find((v) => v.lang.startsWith(lang.split("-")[0])); if (voice) u.voice = voice; u.lang = voice?.lang || lang; u.onend = () => setSpeaking(false); speechSynthesis.speak(u); setSpeaking(true); } }; return ( <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted" onClick={toggle}> {speaking ? <X size={16} /> : <Sparkles size={16} className="text-primary" />} </Button> ); }
function SuggestionButtons({ suggestions, onSuggestionClick }: { suggestions: string[]; onSuggestionClick: (s: string) => void }) { return ( <div className="w-full mt-3 space-y-2"> {suggestions.map((s, i) => ( <button key={i} onClick={() => onSuggestionClick(s)} className="flex items-center gap-2 text-sm bg-card border border-border text-foreground px-4 py-2 rounded-full hover:bg-muted transition-colors shadow-sm w-max" > <Sparkles size={16} className="flex-shrink-0 text-primary" /> <span>{s}</span> </button> ))} </div> );}


// ---------- MAIN COMPONENT ----------
export default function ChatbotPage() {
  const router = useRouter();
  const { translations: t, currentLang, setCurrentLang } = useLanguage();

  // ----- STATE MANAGEMENT -----
  const [chatHistory, setChatHistory] = useState<ChatHistory>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // ----- DATA LOADING & SAVING LOGIC (remains the same)-----
  useEffect(() => {
    const savedHistory = localStorage.getItem("krishi-mitra-conversations");
    const lastActiveId = localStorage.getItem("krishi-mitra-active-chat-id");
    const history = savedHistory ? JSON.parse(savedHistory) : {};
    setChatHistory(history);
    if (lastActiveId && history[lastActiveId]) {
      setActiveChatId(lastActiveId);
      setMessages(history[lastActiveId].messages);
    } else {
      handleNewChat(history);
    }
  }, []);
  useEffect(() => {
    if (Object.keys(chatHistory).length > 0) localStorage.setItem("krishi-mitra-conversations", JSON.stringify(chatHistory));
    if (activeChatId) localStorage.setItem("krishi-mitra-active-chat-id", activeChatId);
  }, [chatHistory, activeChatId]);
  useEffect(() => {
    if (activeChatId && messages.length > 0) {
      setChatHistory(prev => ({...prev, [activeChatId]: {...prev[activeChatId], messages: messages, timestamp: Date.now()}}));
    }
  }, [messages, activeChatId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);
  useEffect(() => { return () => { recognitionRef.current?.stop(); }; }, []);

  // ----- CHAT MANAGEMENT FUNCTIONS (remains the same)-----
  const handleNewChat = (currentHistory = chatHistory) => {
    const newChatId = Date.now().toString();
    const initialMessage: Message = { role: 'bot', text: t.chatbotUI?.initialMessage.text || 'Hello! I am Krishi-Mitra, your agricultural assistant. How can I help you today?', html: t.chatbotUI?.initialMessage.html || 'Hello! I am Krishi-Mitra, your agricultural assistant. How can I help you today?', suggestions: t.chatbotUI?.initialSuggestions || ['What crops are suitable for my region?', 'Identify this plant disease from a photo.', 'When should I plant rice?'], };
    const newChat: Chat = { id: newChatId, title: "New Chat", timestamp: Date.now(), messages: [initialMessage], };
    setChatHistory(prev => ({ ...prev, [newChatId]: newChat }));
    setActiveChatId(newChatId);
    setMessages([initialMessage]);
    setIsSheetOpen(false);
  };
  const handleSelectChat = (id: string) => {
    if (id === activeChatId) { setIsSheetOpen(false); return; };
    setActiveChatId(id);
    setMessages(chatHistory[id].messages);
    setIsSheetOpen(false);
  };

  // ----- CORE API CALL (remains the same)-----
  const sendMessageToGemini = async (message: string, image: File | null) => {
    if (!GEMINI_API_KEY || !activeChatId) return;
    setIsLoading(true);
    const languageMap: Record<Language, string> = { en: "English", hi: "Hindi", mr: "Marathi", pa: "Punjabi", kn: "Kannada", ta: "Tamil" };
    const languageName = languageMap[currentLang];
    const isFirstUserMessage = messages.length === 2 && chatHistory[activeChatId]?.title === "New Chat";
    const titleInstruction = isFirstUserMessage ? "After your response, on a new line, provide a short, 3-5 word title for this conversation prefixed with `Title: `." : "";
    const STRICT_SYSTEM_PROMPT = `You are Krishi-Mitra... You MUST reply in ${languageName}... ${titleInstruction}`;
    let userParts: any[] = [{ text: `${message || "Please analyze the image."}` }];
    if (image) {
        const base64Image = await fileToBase64(image);
        userParts.push({ inline_data: { mime_type: image.type, data: base64Image } });
    }
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: STRICT_SYSTEM_PROMPT }] }, { role: "model", parts: [{ text: "Ok, I am Krishi-Mitra. I will help." }] }, ...messages.map((m) => ({ role: m.role === "bot" ? "model" : "user", parts: [{ text: m.text }] })), { role: "user", parts: userParts }, ], }), });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        let data = await res.json();
        let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response";
        const titleMatch = raw.match(/Title: (.*)/);
        if (titleMatch?.[1] && activeChatId) {
            const newTitle = titleMatch[1].trim();
            setChatHistory(prev => ({ ...prev, [activeChatId]: { ...prev[activeChatId], title: newTitle } }));
            raw = raw.replace(/Title: .*/, "").trim();
        }
        setMessages(p => [...p, { role: "bot", text: raw, html: mdToHtml(raw), suggestions: [] }]);
    } catch (err: any) {
        setMessages(p => [...p, { role: "bot", text: `⚠️ Error: ${err.message}`, html: `⚠️ Error: ${err.message}` }]);
    } finally {
        setIsLoading(false);
    }
  };

  // ----- EVENT HANDLERS (remains the same)-----
  const handleRemoveImage = () => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); } };
  const handleMicClick = () => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setSpeechError("Speech recognition is not supported in this browser."); return; }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = currentLang;
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) { if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript; }
      if (finalTranscript) setInput(prev => prev + finalTranscript + " ");
    };
    recognition.onerror = (event: any) => { setSpeechError(`Speech recognition error: ${event.error}`); };
    recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };
    recognition.start();
    setIsListening(true);
    setSpeechError(null);
  };
  const handleSend = () => {
    if (input.trim() === "" && !imageFile) return;
    const userMsg: Message = { role: "user", text: input, image: imagePreview || undefined };
    setMessages(p => [...p, userMsg]);
    sendMessageToGemini(input, imageFile);
    setInput("");
    handleRemoveImage();
  };
  const handleSuggestionClick = (suggestion: string) => { const userMsg: Message = { role: "user", text: suggestion }; setMessages((p) => [...p, userMsg]); sendMessageToGemini(suggestion, null); };
  const languageOptions: { value: Language; label: string }[] = [ { value: "en", label: "English" }, { value: "hi", label: "हिंदी" }, { value: "mr", label: "मराठी" }, { value: "pa", label: "ਪੰਜਾਬੀ" }, { value: "kn", label: "ಕನ್ನಡ" }, { value: "ta", label: "தமிழ்" }, ];
  const currentChatTitle = activeChatId ? chatHistory[activeChatId]?.title : "Chat Bot";

  // ---------- UI / RENDER ----------
  return (
    <div className="fixed inset-0 z-50 flex bg-background text-foreground">
      {/* --- Sidebar (remains the same) --- */}
      <div className="hidden md:flex md:w-72 lg:w-80"> <ChatHistorySidebar chatHistory={Object.values(chatHistory)} activeChatId={activeChatId} onNewChat={handleNewChat} onSelectChat={handleSelectChat} /> </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* --- Header --- */}
        <header className="border-b border-border bg-card/80 backdrop-blur-md flex-shrink-0">
          <div className="container mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80"><ChatHistorySidebar chatHistory={Object.values(chatHistory)} activeChatId={activeChatId} onNewChat={handleNewChat} onSelectChat={handleSelectChat} /></SheetContent>
            </Sheet>
            
            {/* Back Button Removed */}
            
            <div className="flex flex-col items-center">
                <h1 className="text-lg font-bold text-foreground truncate max-w-[150px] sm:max-w-xs">{currentChatTitle}</h1>
                <p className="text-xs text-primary font-medium">Online</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><Languages className="h-5 w-5" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">{languageOptions.map(o => <DropdownMenuItem key={o.value} onSelect={() => setCurrentLang(o.value)}>{o.label}</DropdownMenuItem>)}</DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* --- Scrollable Chat Area (remains the same) --- */}
        <main className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6 container mx-auto max-w-4xl">
                {messages.map((m, i) => (
                    <div key={i} className={cn("flex items-start gap-3 w-full", m.role === "user" ? "justify-end" : "justify-start")}>
                        {m.role === "bot" && ( <Avatar className="h-8 w-8 bg-primary/20 flex-shrink-0"><AvatarFallback className="bg-transparent"><Bot className="h-5 w-5 text-primary" /></AvatarFallback></Avatar> )}
                        <div className="w-full">
                            <div className={cn("max-w-[85%] rounded-2xl p-3 text-sm shadow-sm inline-block", m.role === "user" ? "bg-primary text-primary-foreground rounded-br-none float-right" : "bg-card border rounded-bl-none text-foreground")}>
                            {m.image && <img src={m.image} alt="User upload" className="rounded-lg mb-2 max-w-full" />}
                            <div dangerouslySetInnerHTML={{ __html: m.html || m.text }}></div>
                            </div>
                            {m.role === "bot" && ( <> <div className="flex items-center gap-1 mt-1"><Speaker text={m.text} lang={currentLang} /></div> {m.suggestions?.length ? <SuggestionButtons suggestions={m.suggestions} onSuggestionClick={handleSuggestionClick} /> : null} </> )}
                        </div>
                        {m.role === "user" && ( <Avatar className="h-8 w-8 flex-shrink-0"><AvatarFallback className="bg-muted text-muted-foreground"><User className="h-5 w-5" /></AvatarFallback></Avatar> )}
                    </div>
                ))}
                {isLoading && ( <div className="flex items-start gap-3 justify-start"> <Avatar className="h-8 w-8 bg-primary/20"><AvatarFallback className="bg-transparent"><Bot className="h-5 w-5 text-primary" /></AvatarFallback></Avatar> <div className="bg-muted rounded-2xl p-3 text-sm rounded-bl-none shadow-sm"><div className="flex items-center gap-2 text-muted-foreground"><LoaderCircle className="animate-spin h-4 w-4 text-primary" /><span>Thinking...</span></div></div> </div> )}
                <div ref={messagesEndRef} />
            </div>
        </main>
        
        {/* --- Footer (remains the same) --- */}
        <footer className="border-t border-border bg-card/80 backdrop-blur-md flex-shrink-0">
          <div className="container mx-auto max-w-4xl p-2 sm:p-4">
            {imagePreview && (
              <div className="relative w-fit mb-2 ml-2">
                <img src={imagePreview} alt="Selected preview" className="h-20 w-20 object-cover rounded-md" />
                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={handleRemoveImage}><X className="h-4 w-4" /></Button>
              </div>
            )}
            {speechError && <p className="text-xs text-destructive mb-2 ml-4">{speechError}</p>}
            
            <div className="relative flex w-full items-center rounded-full border bg-background focus-within:ring-1 focus-within:ring-primary transition-all">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              
              <Button variant="ghost" size="icon" className="h-9 w-9 ml-1 rounded-full flex-shrink-0" onClick={() => fileInputRef.current?.click()}><Paperclip className="h-5 w-5" /></Button>
              
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a farming question..."
                className="flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                rows={1}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              
              <Button variant="ghost" size="icon" className={cn("h-9 w-9 rounded-full flex-shrink-0", isListening && "bg-red-500 text-white hover:bg-red-600 animate-pulse")} onClick={handleMicClick}><Mic className="h-5 w-5" /></Button>

              <Button type="submit" size="icon" className="h-9 w-9 mr-1 rounded-full flex-shrink-0" onClick={handleSend} disabled={isLoading || (input.trim() === "" && !imageFile)}><Send className="h-5 w-5" /></Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}