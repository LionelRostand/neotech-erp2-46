
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const TwoFactorAuth = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [method, setMethod] = useState("app");
  const [verificationCode, setVerificationCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleToggle2FA = (checked: boolean) => {
    if (checked) {
      // When enabling 2FA, show the setup dialog
      setIsDialogOpen(true);
    } else {
      // When disabling 2FA, just update the state
      setIs2FAEnabled(false);
      toast({
        title: "2FA désactivée",
        description: "L'authentification à deux facteurs a été désactivée.",
      });
    }
  };

  const handleMethodChange = (value: string) => {
    setMethod(value);
  };

  const handleVerifyCode = () => {
    setIsVerifying(true);
    
    // Simuler une vérification du code
    setTimeout(() => {
      setIsVerifying(false);
      
      if (verificationCode === "123456") {
        setIsDialogOpen(false);
        setIs2FAEnabled(true);
        toast({
          title: "2FA activée",
          description: "L'authentification à deux facteurs a été activée avec succès.",
        });
      } else {
        toast({
          title: "Code incorrect",
          description: "Le code de vérification est incorrect. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Authentification à deux facteurs (2FA)</CardTitle>
          <CardDescription>
            Renforcez la sécurité de votre compte en ajoutant une couche de protection supplémentaire.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Activer l'authentification à deux facteurs</h4>
              <p className="text-sm text-muted-foreground">
                Protégez votre compte en demandant une vérification supplémentaire lors de la connexion.
              </p>
            </div>
            <Switch checked={is2FAEnabled} onCheckedChange={handleToggle2FA} />
          </div>

          {is2FAEnabled && (
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Méthode d'authentification</h4>
              <RadioGroup value={method} onValueChange={handleMethodChange}>
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
        {is2FAEnabled && (
          <CardFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              Modifier la configuration 2FA
            </Button>
          </CardFooter>
        )}
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configuration 2FA</DialogTitle>
            <DialogDescription>
              {method === "app" ? (
                "Scannez le code QR avec votre application d'authentification ou saisissez la clé manuellement."
              ) : method === "sms" ? (
                "Un code de vérification sera envoyé à votre numéro de téléphone lors de la connexion."
              ) : (
                "Un code de vérification sera envoyé à votre adresse email lors de la connexion."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {method === "app" && (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-gray-200 w-48 h-48 flex items-center justify-center text-xs text-gray-500">
                  [Code QR simulé]
                </div>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                  ABCD-EFGH-IJKL-MNOP
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="verification-code">
                Entrez le code de vérification
                {method === "app" ? " généré par l'application" : " reçu"}
              </Label>
              <Input
                id="verification-code"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="text-center tracking-[0.5em] font-mono"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Pour cette démonstration, utilisez le code 123456.
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
    </>
  );
};

export default TwoFactorAuth;
