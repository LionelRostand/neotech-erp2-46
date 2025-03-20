
import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Notification } from '../types/project-types';
import { Timestamp } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, Calendar, MessageSquare, UserCheck, GitPullRequest } from 'lucide-react';
import { orderBy, where } from 'firebase/firestore';

export const ProjectNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const notificationsCollection = useFirestore(COLLECTIONS.PROJECTS.NOTIFICATIONS);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const constraints = [
          orderBy('createdAt', 'desc'),
          where('read', '==', false)
        ];
        
        const data = await notificationsCollection.getAll(constraints);
        
        const notificationsData = data.map((doc: any) => {
          const createdAtTimestamp = doc.createdAt as Timestamp;
          return {
            id: doc.id,
            userId: doc.userId || '',
            title: doc.title || '',
            content: doc.content || '',
            read: doc.read || false,
            type: doc.type || 'project_update',
            linkTo: doc.linkTo || '',
            createdAt: createdAtTimestamp 
              ? new Date(createdAtTimestamp.seconds * 1000).toISOString() 
              : new Date().toISOString(),
          } as Notification;
        });
        
        setNotifications(notificationsData.slice(0, 10)); // Only show 10 most recent
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return <UserCheck className="h-5 w-5 text-blue-500" />;
      case 'task_due':
        return <Calendar className="h-5 w-5 text-yellow-500" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'team_update':
        return <UserCheck className="h-5 w-5 text-purple-500" />;
      default:
        return <GitPullRequest className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Assignation</Badge>;
      case 'task_due':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Échéance</Badge>;
      case 'comment':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Commentaire</Badge>;
      case 'team_update':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Équipe</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Mise à jour</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Chargement des notifications...</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <Bell className="h-10 w-10 mb-4 opacity-20" />
        <p>Aucune notification pour le moment</p>
        <p className="text-sm mt-1">Les mises à jour importantes apparaîtront ici</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => {
        const createdAt = new Date(notification.createdAt);
        const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true, locale: fr });
        
        return (
          <div key={notification.id} className="flex p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
            <div className="mr-3 mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-sm">{notification.title}</div>
                {getNotificationBadge(notification.type)}
              </div>
              <p className="text-sm text-gray-600">{notification.content}</p>
              <div className="text-xs text-gray-400 mt-1">{timeAgo}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
