
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, QrCode } from 'lucide-react';

const TwoFactorSettings = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  // Dans un cas réel, cette clé serait générée côté serveur
  const demoSecretKey = 'NEOTECH2FASECRET123456';
  
  const handleVerifyCode = () => {
    // Dans un cas réel, on vérifierait le code avec le backend
    if (verificationCode === '123456') {
      toast.success("Code vérifié avec succès");
      setShowQRDialog(false);
      setIs2FAEnabled(true);
    } else {
      toast.error("Code incorrect");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          Authentification à deux facteurs (2FA)
        </h1>
        <p className="mb-4">
          Gérez les paramètres de sécurité pour l'authentification à deux facteurs.
        </p>
        
        <Card className="bg-white p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">État du 2FA</h2>
              <p className="text-gray-500">
                Activez ou désactivez l'authentification à deux facteurs
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowQRDialog(true)}
                disabled={is2FAEnabled}
              >
                <QrCode className="w-4 h-4 mr-2" />
                Configurer 2FA
              </Button>
              <Switch 
                id="2fa-status" 
                checked={is2FAEnabled}
                onCheckedChange={setIs2FAEnabled}
              />
            </div>
          </div>
        </Card>
        
        <Card className="bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Options disponibles</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox id="2fa-app" defaultChecked />
              <label htmlFor="2fa-app">
                Application d'authentification (Google Authenticator, Authy)
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox id="2fa-sms" />
              <label htmlFor="2fa-sms">SMS</label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox id="2fa-email" />
              <label htmlFor="2fa-email">Email</label>
            </div>
          </div>
        </Card>

        <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configuration 2FA</DialogTitle>
              <DialogDescription>
                Scannez ce QR code avec votre application d'authentification
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-6 py-4">
              <div className="bg-white p-4 rounded-lg border">
                <QRCodeSVG 
                  value={`otpauth://totp/NEOTECH:admin@neotech-consulting.com?secret=${demoSecretKey}&issuer=NEOTECH`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="w-full space-y-2">
                <p className="text-sm text-center text-gray-500">
                  Code secret: <span className="font-mono">{demoSecretKey}</span>
                </p>
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="Entrez le code à 6 chiffres"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="text-center tracking-widest font-mono"
                  />
                  <Button onClick={handleVerifyCode}>
                    <Lock className="w-4 h-4 mr-2" />
                    Vérifier
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TwoFactorSettings;
