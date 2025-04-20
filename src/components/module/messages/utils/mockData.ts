
import { 
  Message, 
  Contact, 
  MessageGroup, 
  MessageTemplate,
  MessageCategoryType,
  MessageTag
} from '../types/message-types';

// Helper function to generate random dates within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate mock contacts
export const generateMockContacts = (count = 10): Contact[] => {
  const firstNames = ['Jean', 'Sophie', 'Thomas', 'Marie', 'Pierre', 'Émilie', 'François', 'Claire', 'Michel', 'Céline'];
  const lastNames = ['Dubois', 'Martin', 'Bernard', 'Petit', 'Robert', 'Richard', 'Durand', 'Moreau', 'Simon', 'Laurent'];
  const companies = ['Neotech', 'TechCorp', 'InnoSys', 'DataFlow', 'WebVision', 'NetPulse', 'SmartTech', 'DigitalEdge', 'TechWave', 'FutureSoft'];
  
  return Array(count).fill(null).map((_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return {
      id: `contact-${index + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+33 ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
      company: companies[Math.floor(Math.random() * companies.length)],
      position: ['Développeur', 'Chef de projet', 'Designer', 'Marketing', 'RH', 'Commercial', 'Directeur', 'Consultant'][Math.floor(Math.random() * 8)],
      isActive: Math.random() > 0.2,
      createdAt: randomDate(new Date(2022, 0, 1), new Date()),
      updatedAt: new Date()
    };
  });
};

// Generate mock messages
export const generateMockMessages = (count = 20, contactsData: Contact[] = []): Message[] => {
  const subjects = [
    'Réunion de projet', 
    'Demande d\'information', 
    'Suivi client', 
    'Proposition commerciale',
    'Rapport hebdomadaire',
    'Invitation événement',
    'Mise à jour produit',
    'Support technique',
    'Formation équipe',
    'Plan stratégique'
  ];
  
  const contents = [
    'Bonjour, pouvez-vous me tenir informé de l\'avancement du projet?',
    'Je vous contacte concernant notre dernière discussion sur l\'implémentation des nouvelles fonctionnalités.',
    'Suite à notre réunion, voici les points qui ont été validés et les prochaines étapes.',
    'Je vous transmets le rapport demandé avec les données actualisées.',
    'Merci pour votre aide, cela a permis de résoudre rapidement le problème.',
    'Nous souhaiterions organiser une réunion pour discuter des nouvelles opportunités.',
    'Veuillez trouver ci-joint les informations demandées concernant notre offre.',
    'Je vous confirme que votre demande a bien été prise en compte et sera traitée dans les meilleurs délais.',
    'Nous vous invitons à notre prochain événement qui aura lieu le mois prochain.',
    'Suite à votre demande, voici les détails techniques que vous avez demandés.'
  ];
  
  // Make sure we have some contacts to use
  const contacts = contactsData.length > 0 ? 
    contactsData : 
    generateMockContacts(10);
  
  const priorities: ["high", "normal", "low", "urgent"] = ["high", "normal", "low", "urgent"];
  const categories: ["business", "personal", "marketing", "support", "other"] = ["business", "personal", "marketing", "support", "other"];
  const statuses: ["draft", "sent", "received", "read", "scheduled", "archived"] = ["draft", "sent", "received", "read", "scheduled", "archived"];
  
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const oneMonthAhead = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  
  return Array(count).fill(null).map((_, index) => {
    const sender = contacts[Math.floor(Math.random() * contacts.length)];
    const recipientCount = Math.floor(Math.random() * 3) + 1;
    const recipients = Array(recipientCount).fill(null).map(() => {
      const contact = contacts[Math.floor(Math.random() * contacts.length)];
      return `${contact.firstName} ${contact.lastName}`;
    });
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isScheduled = status === 'scheduled';
    const isRead = ['read', 'archived'].includes(status);
    const isArchived = status === 'archived';
    
    const createdAt = randomDate(oneMonthAgo, now);
    let scheduledAt = null;
    
    if (isScheduled) {
      scheduledAt = randomDate(now, oneMonthAhead);
    }
    
    return {
      id: `message-${index + 1}`,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      content: contents[Math.floor(Math.random() * contents.length)],
      sender: `${sender.firstName} ${sender.lastName}`,
      recipients,
      status,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      tags: ['important', 'client', 'projet', 'urgent', 'suivi'].slice(0, Math.floor(Math.random() * 3) + 1),
      hasAttachments: Math.random() > 0.7,
      isArchived,
      isRead,
      isScheduled,
      isFavorite: Math.random() > 0.8,
      scheduledAt,
      createdAt,
      updatedAt: new Date(),
      emailStatus: isScheduled ? 'pending' : (Math.random() > 0.8 ? 'failed' : 'sent')
    };
  });
};

// Generate mock message groups
export const generateMockMessageGroups = (count = 5, contactsData: Contact[] = []): MessageGroup[] => {
  const groups = [
    'Équipe Projet A',
    'Service Marketing',
    'Comité de Direction',
    'Support Clients',
    'Département IT',
    'Groupe Commercial',
    'Ressources Humaines',
    'Consultants Externes',
    'Partenaires Stratégiques',
    'Groupe R&D'
  ];
  
  // Make sure we have some contacts to use
  const contacts = contactsData.length > 0 ? 
    contactsData : 
    generateMockContacts(10);
  
  return Array(count).fill(null).map((_, index) => {
    const memberCount = Math.floor(Math.random() * 5) + 2;
    const members = Array(memberCount).fill(null).map(() => {
      const contact = contacts[Math.floor(Math.random() * contacts.length)];
      return contact.id;
    });
    
    return {
      id: `group-${index + 1}`,
      name: groups[Math.floor(Math.random() * groups.length)],
      description: `Groupe de communication pour ${groups[Math.floor(Math.random() * groups.length)].toLowerCase()}`,
      members: [...new Set(members)], // Remove duplicates
      createdAt: randomDate(new Date(2022, 0, 1), new Date()),
      updatedAt: new Date(),
      createdBy: contacts[Math.floor(Math.random() * contacts.length)].id
    };
  });
};

// Generate mock message templates
export const generateMockMessageTemplates = (count = 5): MessageTemplate[] => {
  const templates = [
    { name: 'Bienvenue Client', subject: 'Bienvenue chez Neotech!', content: 'Cher client, nous sommes ravis de vous accueillir...' },
    { name: 'Relance Facture', subject: 'Rappel : Facture en attente', content: 'Nous vous rappelons que votre facture #REF est en attente de paiement...' },
    { name: 'Confirmation Commande', subject: 'Votre commande est confirmée', content: 'Merci pour votre commande. Voici les détails de confirmation...' },
    { name: 'Invitation Webinar', subject: 'Invitation : Webinar sur les nouvelles technologies', content: 'Nous avons le plaisir de vous inviter à notre prochain webinar...' },
    { name: 'Demande de Feedback', subject: 'Votre avis nous intéresse', content: 'Afin d\'améliorer continuellement nos services, nous aimerions avoir votre retour...' },
    { name: 'Support Technique', subject: 'Votre ticket de support', content: 'Votre demande de support a été enregistrée sous la référence #REF...' },
    { name: 'Mise à Jour Service', subject: 'Mise à jour importante de nos services', content: 'Nous souhaitons vous informer d\'une mise à jour importante...' },
    { name: 'Remerciement', subject: 'Merci pour votre confiance', content: 'Nous tenons à vous remercier sincèrement pour votre confiance...' }
  ];
  
  const categories: ["business", "personal", "marketing", "support", "other"] = ["business", "personal", "marketing", "support", "other"];
  
  return Array(count).fill(null).map((_, index) => {
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return {
      id: `template-${index + 1}`,
      name: template.name,
      subject: template.subject,
      content: template.content,
      category: categories[Math.floor(Math.random() * categories.length)],
      tags: ['template', 'automatique', 'standard'].slice(0, Math.floor(Math.random() * 3) + 1),
      createdAt: randomDate(new Date(2022, 0, 1), new Date()),
      updatedAt: new Date(),
      createdBy: `user-${Math.floor(Math.random() * 5) + 1}`,
      isDefault: index === 0 // First one is default
    };
  });
};

// Generate mock message categories
export const generateMockMessageCategories = (): MessageCategoryType[] => {
  const categories = [
    { name: 'Business', color: '#4CAF50', description: 'Communications professionnelles' },
    { name: 'Personnel', color: '#2196F3', description: 'Communications personnelles' },
    { name: 'Marketing', color: '#FF9800', description: 'Campagnes marketing et promotions' },
    { name: 'Support', color: '#9C27B0', description: 'Support technique et assistance' },
    { name: 'Autre', color: '#607D8B', description: 'Autres types de communications' }
  ];
  
  return categories.map((category, index) => ({
    id: `category-${index + 1}`,
    name: category.name,
    description: category.description,
    color: category.color,
    createdAt: randomDate(new Date(2022, 0, 1), new Date()),
    updatedAt: new Date()
  }));
};

// Generate mock message tags
export const generateMockMessageTags = (): MessageTag[] => {
  const tags = [
    { name: 'Important', color: '#F44336' },
    { name: 'Urgent', color: '#FF5722' },
    { name: 'Suivi', color: '#4CAF50' },
    { name: 'Projet', color: '#2196F3' },
    { name: 'Client', color: '#9C27B0' },
    { name: 'Interne', color: '#607D8B' },
    { name: 'Externe', color: '#795548' },
    { name: 'Archive', color: '#9E9E9E' }
  ];
  
  return tags.map((tag, index) => ({
    id: `tag-${index + 1}`,
    name: tag.name,
    color: tag.color,
    createdAt: randomDate(new Date(2022, 0, 1), new Date()),
    updatedAt: new Date()
  }));
};

// Function to generate a complete set of mock data for the messages module
export const generateMockMessagesData = () => {
  const contacts = generateMockContacts(15);
  const messages = generateMockMessages(30, contacts);
  const groups = generateMockMessageGroups(5, contacts);
  const templates = generateMockMessageTemplates(8);
  const categories = generateMockMessageCategories();
  const tags = generateMockMessageTags();
  
  return {
    contacts,
    messages,
    groups,
    templates,
    categories,
    tags
  };
};
