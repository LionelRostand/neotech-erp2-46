
import React from 'react';
import { MessageMetrics } from '../types/message-types';
import { Card } from '@/components/ui/card';
import { MessageSquare, Archive, Clock, Mail, Send, UserCheck } from 'lucide-react';

interface MessageMetricsCardsProps {
  metrics: MessageMetrics;
  isLoading?: boolean;
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
      <h3 className="text-2xl font-bold">{value ? value.toLocaleString() : '0'}</h3>
    </div>
  </Card>
);

const MessageMetricsCards: React.FC<MessageMetricsCardsProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4 flex items-center animate-pulse">
            <div className="mr-4 p-2 rounded-full bg-gray-200 h-10 w-10"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <MetricCard 
        title="Messages totaux" 
        value={metrics.totalMessages || 0} 
        icon={<MessageSquare className="h-5 w-5 text-primary" />} 
      />
      <MetricCard 
        title="Non lus" 
        value={metrics.unreadMessages || 0} 
        icon={<Mail className="h-5 w-5 text-blue-500" />} 
        className="border-blue-100"
      />
      <MetricCard 
        title="Archivés" 
        value={metrics.archivedMessages || 0} 
        icon={<Archive className="h-5 w-5 text-amber-500" />} 
        className="border-amber-100"
      />
      <MetricCard 
        title="Programmés" 
        value={metrics.scheduledMessages || 0} 
        icon={<Clock className="h-5 w-5 text-indigo-500" />} 
        className="border-indigo-100"
      />
      <MetricCard 
        title="Envoyés aujourd'hui" 
        value={metrics.messagesSentToday || 0} 
        icon={<Send className="h-5 w-5 text-green-500" />} 
        className="border-green-100"
      />
      <MetricCard 
        title="Contacts" 
        value={metrics.contactsCount || 0} 
        icon={<UserCheck className="h-5 w-5 text-purple-500" />} 
        className="border-purple-100"
      />
    </div>
  );
};

export default MessageMetricsCards;
