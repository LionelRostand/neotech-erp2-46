
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const PersonalInfo = () => {
  const { userData } = useAuth();

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Informations personnelles</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfilePhotoUpload />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              defaultValue={userData?.firstName}
              readOnly
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              defaultValue={userData?.lastName}
              readOnly
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              defaultValue={userData?.email}
              readOnly
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Input
              id="role"
              defaultValue={userData?.role}
              readOnly
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
