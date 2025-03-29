
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Search, 
  MoreHorizontal, 
  PhoneCall, 
  VideoIcon, 
  Image, 
  PaperclipIcon, 
  Smile,
} from "lucide-react";

// Dummy conversation data
const conversations = [
  {
    id: 1,
    name: 'Alexandre Dupont',
    lastMessage: 'À quelle heure arrivera le chauffeur demain ?',
    time: '10:45',
    unread: 2,
    avatar: ''
  },
  {
    id: 2,
    name: 'Marie Leroy',
    lastMessage: 'Merci pour votre réponse rapide.',
    time: '09:32',
    unread: 0,
    avatar: ''
  },
  {
    id: 3,
    name: 'Entreprise ABC',
    lastMessage: 'Pouvez-vous envoyer la facture par email ?',
    time: 'Hier',
    unread: 0,
    avatar: ''
  },
  {
    id: 4,
    name: 'Jean Martin',
    lastMessage: 'Je souhaite modifier ma réservation pour la semaine prochaine.',
    time: 'Hier',
    unread: 1,
    avatar: ''
  },
];

// Dummy messages for active conversation
const dummyMessages = [
  {
    id: 1,
    senderId: 1,
    content: 'Bonjour, j\'aimerais savoir à quelle heure mon chauffeur arrivera demain ?',
    time: '10:32',
    read: true
  },
  {
    id: 2,
    senderId: 'agent',
    content: 'Bonjour M. Dupont, votre chauffeur est prévu pour 9h30. Il vous contactera 15 minutes avant son arrivée.',
    time: '10:40',
    read: true
  },
  {
    id: 3,
    senderId: 1,
    content: 'À quelle heure arrivera le chauffeur demain ?',
    time: '10:45',
    read: false
  },
];

const ChatTab: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real application, this would send the message to the backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-lg border h-[calc(100vh-300px)] min-h-[500px] overflow-hidden">
      <div className="grid grid-cols-12 h-full">
        {/* Left sidebar - Conversation list */}
        <div className="col-span-4 border-r">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une conversation..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
            {conversations.map((convo) => (
              <div
                key={convo.id}
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                  activeConversation.id === convo.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => setActiveConversation(convo)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={convo.avatar} alt={convo.name} />
                  <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between">
                    <p className="font-medium truncate">{convo.name}</p>
                    <span className="text-xs text-muted-foreground">{convo.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                </div>
                {convo.unread > 0 && (
                  <Badge className="ml-2 bg-primary h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {convo.unread}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Right side - Active conversation */}
        <div className="col-span-8 flex flex-col h-full">
          {/* Conversation header */}
          <div className="p-3 border-b flex justify-between items-center">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activeConversation?.avatar} alt={activeConversation?.name} />
                <AvatarFallback>{activeConversation?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">{activeConversation?.name}</p>
                <p className="text-xs text-muted-foreground">En ligne</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" title="Appel audio">
                <PhoneCall className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Appel vidéo">
                <VideoIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Plus d'options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 420px)' }}>
            {dummyMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === 'agent' ? 'justify-start' : 'justify-end'}`}
              >
                {msg.senderId === 'agent' && (
                  <Avatar className="h-8 w-8 mt-1 mr-2">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.senderId === 'agent'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Message input */}
          <div className="p-3 border-t">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" title="Joindre un fichier">
                <PaperclipIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Envoyer une image">
                <Image className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Tapez un message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" title="Emoji">
                <Smile className="h-4 w-4" />
              </Button>
              <Button size="icon" title="Envoyer" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;
