
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Plus, Send, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface EmailTicket {
  id: string;
  subject: string;
  email: string;
  message: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  date: Date;
}

const mockTickets: EmailTicket[] = [
  {
    id: 'TKT-001',
    subject: 'Problème de réservation',
    email: 'client1@example.com',
    message: 'Je n\'arrive pas à modifier ma réservation du 15 juin. Pouvez-vous m\'aider?',
    status: 'in-progress',
    date: new Date(Date.now() - 86400000 * 2) // 2 days ago
  },
  {
    id: 'TKT-002',
    subject: 'Demande d\'information',
    email: 'client2@example.com',
    message: 'Je souhaite connaître vos tarifs pour un trajet Paris-Lyon en VIP.',
    status: 'pending',
    date: new Date(Date.now() - 43200000) // 12 hours ago
  },
  {
    id: 'TKT-003',
    subject: 'Remboursement',
    email: 'client3@example.com',
    message: 'J\'ai annulé ma réservation il y a une semaine et je n\'ai toujours pas été remboursé.',
    status: 'resolved',
    date: new Date(Date.now() - 86400000 * 5) // 5 days ago
  }
];

const EmailSupportTab: React.FC = () => {
  const [tickets, setTickets] = useState<EmailTicket[]>(mockTickets);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<EmailTicket | null>(null);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    email: '',
    message: ''
  });
  const [reply, setReply] = useState('');

  const handleTicketCreate = () => {
    // Validation basique
    if (!newTicket.subject || !newTicket.email || !newTicket.message) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const ticket: EmailTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newTicket.subject,
      email: newTicket.email,
      message: newTicket.message,
      status: 'pending',
      date: new Date()
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: '', email: '', message: '' });
    setShowNewTicket(false);
    toast.success("Ticket créé avec succès");
  };

  const handleStatusChange = (id: string, status: EmailTicket['status']) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, status } : ticket
    ));
    
    const statusMessages = {
      'pending': 'Ticket marqué comme en attente',
      'in-progress': 'Ticket en cours de traitement',
      'resolved': 'Ticket résolu avec succès',
      'closed': 'Ticket fermé'
    };
    
    toast.success(statusMessages[status]);
  };

  const handleSendReply = () => {
    if (!reply.trim()) {
      toast.error("Veuillez entrer un message");
      return;
    }
    
    toast.success(`Réponse envoyée à ${selectedTicket?.email}`);
    
    // Mettre à jour le statut
    if (selectedTicket) {
      handleStatusChange(selectedTicket.id, 'in-progress');
    }
    
    setReply('');
  };

  const getStatusIcon = (status: EmailTicket['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed': return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: EmailTicket['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in-progress': return 'En cours';
      case 'resolved': return 'Résolu';
      case 'closed': return 'Fermé';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (showNewTicket) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Nouveau Ticket de Support</h3>
            <Button variant="outline" onClick={() => setShowNewTicket(false)}>
              Retour
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={newTicket.email}
                onChange={e => setNewTicket({...newTicket, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                placeholder="Sujet de votre demande"
                value={newTicket.subject}
                onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Détaillez votre demande ici..."
                rows={6}
                value={newTicket.message}
                onChange={e => setNewTicket({...newTicket, message: e.target.value})}
              />
            </div>
            
            <Button className="w-full" onClick={handleTicketCreate}>
              <Send className="mr-2 h-4 w-4" /> Envoyer la demande
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedTicket) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">{selectedTicket.subject}</h3>
            <Button variant="outline" onClick={() => setSelectedTicket(null)}>
              Retour à la liste
            </Button>
          </div>
          
          <div className="border rounded-md p-4 mb-4 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">{selectedTicket.email}</span>
              <span className="text-sm text-gray-500">{formatDate(selectedTicket.date)}</span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.message}</p>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Label>Statut:</Label>
              <div className="flex items-center gap-1">
                {getStatusIcon(selectedTicket.status)}
                <span className="text-sm">{getStatusText(selectedTicket.status)}</span>
              </div>
              <div className="ml-auto space-x-2">
                <Button 
                  size="sm" 
                  variant={selectedTicket.status === 'pending' ? "default" : "outline"}
                  onClick={() => handleStatusChange(selectedTicket.id, 'pending')}
                >
                  En attente
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedTicket.status === 'in-progress' ? "default" : "outline"}
                  onClick={() => handleStatusChange(selectedTicket.id, 'in-progress')}
                >
                  En cours
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedTicket.status === 'resolved' ? "default" : "outline"}
                  onClick={() => handleStatusChange(selectedTicket.id, 'resolved')}
                >
                  Résolu
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedTicket.status === 'closed' ? "default" : "outline"}
                  onClick={() => handleStatusChange(selectedTicket.id, 'closed')}
                >
                  Fermé
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="reply">Répondre</Label>
            <Textarea
              id="reply"
              placeholder="Votre réponse..."
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <Button onClick={handleSendReply}>
              <Send className="mr-2 h-4 w-4" /> Envoyer la réponse
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Tickets de Support</h3>
          <Button onClick={() => setShowNewTicket(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nouveau Ticket
          </Button>
        </div>
        
        {tickets.length > 0 ? (
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div 
                key={ticket.id}
                className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium mb-1">{ticket.subject}</div>
                    <div className="text-sm text-gray-500">{ticket.email}</div>
                    <div className="mt-2 text-sm text-gray-700 line-clamp-2">{ticket.message}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-xs text-gray-500">{formatDate(ticket.date)}</div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(ticket.status)}
                      <span className="text-xs">{getStatusText(ticket.status)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-[200px]">
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun ticket</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Vous n'avez actuellement aucun ticket de support. Créez-en un nouveau pour démarrer.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailSupportTab;
