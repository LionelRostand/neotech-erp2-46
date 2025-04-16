
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee, Education } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Check, PenLine, Plus, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CompetencesTabProps {
  employee: Employee;
  onEmployeeUpdated?: (skills: string[], education: Education[]) => void;
  editMode?: boolean;
}

const CompetencesTab: React.FC<CompetencesTabProps> = ({ 
  employee, 
  onEmployeeUpdated,
  editMode = false
}) => {
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [skills, setSkills] = useState<string[]>(employee.skills || []);
  const [newSkill, setNewSkill] = useState('');
  
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [education, setEducation] = useState<Education[]>(employee.education || []);
  const [newEducation, setNewEducation] = useState<Education>({ degree: '', school: '', year: '' });

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSaveSkills = () => {
    if (onEmployeeUpdated) {
      onEmployeeUpdated(skills, education);
    }
    setIsEditingSkills(false);
  };

  const handleAddEducation = () => {
    if (newEducation.degree.trim() && newEducation.school.trim()) {
      setEducation([...education, { ...newEducation }]);
      setNewEducation({ degree: '', school: '', year: '' });
    }
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleEducationChange = (field: keyof Education, value: string) => {
    setNewEducation({ ...newEducation, [field]: value });
  };

  const handleSaveEducation = () => {
    if (onEmployeeUpdated) {
      onEmployeeUpdated(skills, education);
    }
    setIsEditingEducation(false);
  };

  return (
    <div className="space-y-6">
      {/* Compétences */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Compétences</CardTitle>
          {editMode && !isEditingSkills && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditingSkills(true)}
            >
              <PenLine className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
          {editMode && isEditingSkills && (
            <div className="flex space-x-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSaveSkills}
              >
                <Check className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditingSkills(false)}
              >
                Annuler
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isEditingSkills ? (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 hover:bg-transparent" 
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      <Trash className="h-3 w-3 text-red-500" />
                    </Button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Nouvelle compétence" 
                  className="flex-1"
                />
                <Button onClick={handleAddSkill}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          ) : skills.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Aucune compétence renseignée
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Formation</CardTitle>
          {editMode && !isEditingEducation && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditingEducation(true)}
            >
              <PenLine className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
          {editMode && isEditingEducation && (
            <div className="flex space-x-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSaveEducation}
              >
                <Check className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditingEducation(false)}
              >
                Annuler
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Diplôme</TableHead>
                <TableHead>École / Université</TableHead>
                <TableHead>Année</TableHead>
                {isEditingEducation && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {education.length > 0 ? (
                education.map((edu, index) => (
                  <TableRow key={index}>
                    <TableCell>{edu.degree}</TableCell>
                    <TableCell>{edu.school}</TableCell>
                    <TableCell>{edu.year}</TableCell>
                    {isEditingEducation && (
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveEducation(index)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isEditingEducation ? 4 : 3} className="text-center py-4 text-gray-500">
                    Aucune formation renseignée
                  </TableCell>
                </TableRow>
              )}

              {isEditingEducation && (
                <TableRow>
                  <TableCell>
                    <Input 
                      value={newEducation.degree} 
                      onChange={(e) => handleEducationChange('degree', e.target.value)}
                      placeholder="Diplôme" 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={newEducation.school} 
                      onChange={(e) => handleEducationChange('school', e.target.value)}
                      placeholder="École / Université" 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={newEducation.year} 
                      onChange={(e) => handleEducationChange('year', e.target.value)}
                      placeholder="Année" 
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={handleAddEducation}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Évaluations */}
      <Card>
        <CardHeader>
          <CardTitle>Évaluations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            Aucune évaluation disponible
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetencesTab;
