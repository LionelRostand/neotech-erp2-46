
import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Shield, Key } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { COLLECTIONS } from '@/lib/firebase-collections';

const TwoFactorAuth = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [method, setMethod] = useState("app");
  const [verificationCode, setVerificationCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentUser } = useAuth();

  // Dans un cas réel, cette clé serait générée côté serveur
  const demoSecretKey = 'NEOTECH2FASECRET123456';

  // Charger l'état initial de la 2FA depuis Firestore
  useEffect(() => {
    const load2FAStatus = async () => {
      if (!currentUser?.uid) return;
      
      try {
        const twoFactorRef = doc(db, COLLECTIONS.USERS.MAIN, currentUser.uid);
        const twoFactorDoc = await getDoc(twoFactorRef);
        
        if (twoFactorDoc.exists()) {
          setIs2FAEnabled(twoFactorDoc.data()?.twoFactorEnabled || false);
          setMethod(twoFactorDoc.data()?.twoFactorMethod || "app");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du statut 2FA:", error);
      }
    };

    load2FAStatus();
  }, [currentUser]);

  const handleToggle2FA = async (checked: boolean) => {
    if (checked) {
      setIsDialogOpen(true);
    } else {
      await updateTwoFactorStatus(false);
      setIs2FAEnabled(false);
      toast.success("L'authentification à deux facteurs a été désactivée");
    }
  };

  const updateTwoFactorStatus = async (enabled: boolean) => {
    if (!currentUser?.uid) return;
    
    try {
      const userRef = doc(db, COLLECTIONS.USERS.MAIN, currentUser.uid);
      await setDoc(userRef, {
        twoFactorEnabled: enabled,
        twoFactorMethod: method,
        updatedAt: new Date()
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut 2FA:", error);
      return false;
    }
  };

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    
    // Simuler une vérification du code
    setTimeout(async () => {
      if (verificationCode === "123456") {
        const updated = await updateTwoFactorStatus(true);
        if (updated) {
          setIsDialogOpen(false);
          setIs2FAEnabled(true);
          toast.success("L'authentification à deux facteurs a été activée");
        } else {
          toast.error("Erreur lors de l'activation de la 2FA");
        }
      } else {
        toast.error("Code de vérification incorrect");
      }
      setIsVerifying(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Authentification à deux facteurs (2FA)
        </CardTitle>
        <CardDescription>
          Renforcez la sécurité de votre compte en ajoutant une couche de protection supplémentaire.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="2fa-toggle">Activer l'authentification à deux facteurs</Label>
            <p className="text-sm text-muted-foreground">
              Protégez votre compte en demandant une vérification supplémentaire lors de la connexion.
            </p>
          </div>
          <Switch 
            id="2fa-toggle"
            checked={is2FAEnabled}
            onCheckedChange={handleToggle2FA}
          />
        </div>

        {is2FAEnabled && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Méthode d'authentification</h4>
            <RadioGroup value={method} onValueChange={setMethod}>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="app" id="method-app" />
                  <Label htmlFor="method-app" className="flex-1 cursor-pointer">
                    Application d'authentification (Google Authenticator, Authy)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="sms" id="method-sms" />
                  <Label htmlFor="method-sms" className="flex-1 cursor-pointer">
                    SMS
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="email" id="method-email" />
                  <Label htmlFor="method-email" className="flex-1 cursor-pointer">
                    Email
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Configuration 2FA
            </DialogTitle>
            <DialogDescription>
              {method === "app" && "Scannez le QR code avec votre application d'authentification"}
              {method === "sms" && "Un code de vérification sera envoyé par SMS"}
              {method === "email" && "Un code de vérification sera envoyé par email"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {method === "app" && (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <QRCodeSVG 
                    value={`otpauth://totp/NEOTECH:${currentUser?.email}?secret=${demoSecretKey}&issuer=NEOTECH`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Code secret: <span className="font-mono">{demoSecretKey}</span>
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Code de vérification</Label>
              <Input
                type="text"
                placeholder="Entrez le code à 6 chiffres"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center tracking-widest font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Pour cette démonstration, utilisez le code 123456
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleVerifyCode} disabled={isVerifying}>
              {isVerifying ? "Vérification..." : "Vérifier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TwoFactorAuth;
