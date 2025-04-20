import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import MessageEditor from './MessageEditor';
import { useMessageForm } from './hooks/useMessageForm';
import { useContactsData } from './hooks/useContactsData';
import RecipientSelector from './components/RecipientSelector';
import AttachmentsTab from './components/AttachmentsTab';
import PropertiesTab from './components/PropertiesTab';
import ScheduleTab from './components/ScheduleTab';
import { useSmtpConfig } from '@/hooks/useSmtpConfig';

const ComposePage: React.FC = () => {
  const navigate = useNavigate();
  const { config: smtpConfig } = useSmtpConfig();
  
  const {
    selectedContacts,
    setSelectedContacts,
    subject,
    setSubject,
    content,
    setContent,
    priority,
    setPriority,
    category,
    setCategory,
    tags,
    currentTag,
    setCurrentTag,
    attachments,
    isScheduled,
    setIsScheduled,
    scheduledDate,
    setScheduledDate,
    isSending,
    handleSelectContact,
    handleRemoveContact,
    handleAddTag,
    handleRemoveTag,
    handleFileChange,
    handleRemoveFile,
    handleSendMessage
  } = useMessageForm();

  const {
    filteredContacts,
    searchTerm,
    setSearchTerm,
    showContactSearch,
    setShowContactSearch,
    setSelectedContacts: updateSelectedContacts,
    getInitials
  } = useContactsData();

  React.useEffect(() => {
    updateSelectedContacts(selectedContacts);
  }, [selectedContacts, updateSelectedContacts]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Nouveau message</CardTitle>
            {!smtpConfig && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/modules/messages/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurer SMTP
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RecipientSelector
              selectedContacts={selectedContacts}
              filteredContacts={filteredContacts}
              searchTerm={searchTerm}
              showContactSearch={showContactSearch}
              getInitials={getInitials}
              onSearchChange={setSearchTerm}
              onShowContactSearch={setShowContactSearch}
              onSelectContact={handleSelectContact}
              onRemoveContact={handleRemoveContact}
            />

            <div className="space-y-2">
              <Label htmlFor="subject">Objet</Label>
              <Input 
                id="subject"
                placeholder="Objet du message" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <MessageEditor value={content} onChange={setContent} />
            </div>

            <Tabs defaultValue="attachments">
              <TabsList>
                <TabsTrigger value="attachments">Pièces jointes</TabsTrigger>
                <TabsTrigger value="properties">Propriétés</TabsTrigger>
                <TabsTrigger value="schedule">Programmation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="attachments">
                <AttachmentsTab
                  attachments={attachments}
                  onFileChange={handleFileChange}
                  onRemoveFile={handleRemoveFile}
                />
              </TabsContent>
              
              <TabsContent value="properties">
                <PropertiesTab
                  priority={priority}
                  category={category}
                  tags={tags}
                  currentTag={currentTag}
                  onPriorityChange={setPriority}
                  onCategoryChange={setCategory}
                  onCurrentTagChange={setCurrentTag}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                />
              </TabsContent>
              
              <TabsContent value="schedule">
                <ScheduleTab
                  isScheduled={isScheduled}
                  scheduledDate={scheduledDate}
                  onIsScheduledChange={setIsScheduled}
                  onDateChange={setScheduledDate}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/modules/messages/inbox')}
              disabled={isSending}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {isScheduled ? "Programmation en cours..." : "Envoi en cours..."}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {isScheduled ? "Programmer" : "Envoyer"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComposePage;
