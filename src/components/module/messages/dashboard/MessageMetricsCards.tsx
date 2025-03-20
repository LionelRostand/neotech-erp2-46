
import React from 'react';
import { MessageMetrics } from '../types/message-types';
import { Card } from '@/components/ui/card';
import { MessageSquare, Archive, Clock, Mail, Send, UserCheck } from 'lucide-react';

interface MessageMetricsCardsProps {
  metrics: MessageMetrics;
}

const MetricCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}> = ({ title, value, icon, className }) => (
  <Card className={`p-4 flex items-center ${className}`}>
    <div className="mr-4 p-2 rounded-full bg-primary/10">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
    </div>
  </Card>
);

const MessageMetricsCards: React.FC<MessageMetricsCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <MetricCard 
        title="Messages totaux" 
        value={metrics.totalMessages} 
        icon={<MessageSquare className="h-5 w-5 text-primary" />} 
      />
      <MetricCard 
        title="Non lus" 
        value={metrics.unreadMessages} 
        icon={<Mail className="h-5 w-5 text-blue-500" />} 
        className="border-blue-100"
      />
      <MetricCard 
        title="Archivés" 
        value={metrics.archivedMessages} 
        icon={<Archive className="h-5 w-5 text-amber-500" />} 
        className="border-amber-100"
      />
      <MetricCard 
        title="Programmés" 
        value={metrics.scheduledMessages} 
        icon={<Clock className="h-5 w-5 text-indigo-500" />} 
        className="border-indigo-100"
      />
      <MetricCard 
        title="Envoyés aujourd'hui" 
        value={metrics.messagesSentToday} 
        icon={<Send className="h-5 w-5 text-green-500" />} 
        className="border-green-100"
      />
      <MetricCard 
        title="Contacts" 
        value={metrics.contactsCount} 
        icon={<UserCheck className="h-5 w-5 text-purple-500" />} 
        className="border-purple-100"
      />
    </div>
  );
};

export default MessageMetricsCards;
