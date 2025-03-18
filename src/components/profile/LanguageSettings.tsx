
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const languages = [
  { id: "fr", name: "Français", flag: "🇫🇷" },
  { id: "en", name: "English", flag: "🇬🇧" },
  { id: "es", name: "Español", flag: "🇪🇸" },
  { id: "de", name: "Deutsch", flag: "🇩🇪" },
];

const LanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simuler un changement de langue
    setTimeout(() => {
      setIsLoading(false);
      const langName = languages.find(l => l.id === selectedLanguage)?.name;
      toast({
        title: "Langue mise à jour",
        description: `La langue a été changée pour ${langName}.`,
      });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de langue</CardTitle>
        <CardDescription>
          Choisissez la langue dans laquelle vous souhaitez utiliser l'application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <RadioGroup
            value={selectedLanguage}
            onValueChange={handleLanguageChange}
            className="space-y-4"
          >
            {languages.map((language) => (
              <div
                key={language.id}
                className="flex items-center space-x-2 rounded-md border p-4 hover:bg-accent"
              >
                <RadioGroupItem value={language.id} id={`language-${language.id}`} />
                <Label
                  htmlFor={`language-${language.id}`}
                  className="flex flex-1 items-center gap-2 font-normal cursor-pointer"
                >
                  <span className="text-xl">{language.flag}</span>
                  <span>{language.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <Button type="submit" className="mt-6" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer la préférence"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LanguageSettings;
