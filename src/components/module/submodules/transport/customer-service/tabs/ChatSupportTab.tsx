
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, User, Bot, Clock } from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const ChatSupportTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleConnect = () => {
    setIsConnected(true);
    toast.success("Chat connecté avec succès");
    
    // Ajouter un message de bienvenue
    setTimeout(() => {
      handleAgentMessage("Bonjour, bienvenue sur notre service de support en ligne. Comment puis-je vous aider aujourd'hui?");
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simuler la réponse de l'agent
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      handleAgentResponse(inputMessage);
    }, 1500);
  };

  const handleAgentMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: `a-${Date.now()}`,
      content: content,
      sender: 'agent',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAgentResponse = (userMessage: string) => {
    // Logique simple de réponse automatique
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('bonjour') || lowercaseMessage.includes('salut')) {
      handleAgentMessage("Bonjour! Comment puis-je vous aider aujourd'hui?");
    } 
    else if (lowercaseMessage.includes('reservation') || lowercaseMessage.includes('réservation')) {
      handleAgentMessage("Pour les réservations, veuillez préciser la date, l'heure et le lieu de prise en charge souhaités. Je peux vous aider à compléter votre demande.");
    }
    else if (lowercaseMessage.includes('tarif') || lowercaseMessage.includes('prix')) {
      handleAgentMessage("Nos tarifs varient selon la distance, le type de véhicule et l'heure de prise en charge. Pourriez-vous me donner plus de détails sur votre trajet?");
    }
    else if (lowercaseMessage.includes('annulation')) {
      handleAgentMessage("Pour annuler une réservation, veuillez fournir votre numéro de réservation. Les annulations effectuées 24h avant le départ sont remboursées intégralement.");
    }
    else if (lowercaseMessage.includes('contact') || lowercaseMessage.includes('téléphone')) {
      handleAgentMessage("Vous pouvez nous joindre par téléphone au +33 1 23 45 67 89 ou par email à support@transport.com");
    }
    else {
      handleAgentMessage("Merci pour votre message. Un de nos agents va vous répondre dans les plus brefs délais. Avez-vous besoin d'autres informations?");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isConnected) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center h-[400px] space-y-6">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Support Chat</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Commencez une conversation avec notre équipe de support pour obtenir de l'aide instantanée concernant vos réservations, questions ou problèmes.
              </p>
              <Button onClick={handleConnect} className="bg-blue-500 hover:bg-blue-600">
                Démarrer une conversation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex flex-col h-[500px]">
          <div className="bg-blue-500 text-white p-4 rounded-t-md">
            <h3 className="text-lg font-medium">Support Client</h3>
            <p className="text-sm opacity-80">Nos agents sont disponibles 24/7</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
                  <Avatar className={message.sender === 'user' ? 'bg-blue-500' : 'bg-gray-500'}>
                    <AvatarFallback>{message.sender === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className={`rounded-lg p-3 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'}`}>
                      {message.content}
                    </div>
                    <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'} text-gray-500`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-gray-200 rounded-lg p-3 text-sm">
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Agent est en train d'écrire...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t">
            <form 
              className="flex items-center gap-2" 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Input 
                placeholder="Tapez votre message ici..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatSupportTab;
