
import React from 'react';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Users, UserPlus } from 'lucide-react';
import KanbanColumn from '@/components/module/submodules/recruitment/KanbanColumn';

const RecruitmentTab = () => {
  const { recruitmentPosts, isLoading } = useRecruitmentFirebaseData();

  const openPosts = recruitmentPosts.filter(post => post.status === 'Ouverte');
  const inProgressPosts = recruitmentPosts.filter(post => post.status === 'En cours');
  const interviewPosts = recruitmentPosts.filter(post => post.status === 'Entretiens');
  const closedPosts = recruitmentPosts.filter(post => post.status === 'Fermée');

  return (
    <Card>
      <CardContent>
        <div className="mb-6">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList>
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Postes ouverts</span>
              </TabsTrigger>
              <TabsTrigger value="candidates" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Candidats</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <div className="flex justify-end mb-4">
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Nouveau poste
                </Button>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4">
                <KanbanColumn 
                  id="Ouverte"
                  title="Postes ouverts"
                  items={openPosts}
                />
                <KanbanColumn 
                  id="En cours"
                  title="En cours"
                  items={inProgressPosts}
                />
                <KanbanColumn 
                  id="Entretiens"
                  title="Entretiens"
                  items={interviewPosts}
                />
                <KanbanColumn 
                  id="Fermée"
                  title="Fermés"
                  items={closedPosts}
                />
              </div>
            </TabsContent>

            <TabsContent value="candidates">
              <div className="text-center py-8 text-muted-foreground">
                Module de gestion des candidats en développement...
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecruitmentTab;
