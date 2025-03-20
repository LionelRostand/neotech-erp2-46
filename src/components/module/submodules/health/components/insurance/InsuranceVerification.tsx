
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Search,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  User,
  FileText
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const InsuranceVerification: React.FC = () => {
  const [patientId, setPatientId] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState<null | {
    valid: boolean;
    details?: {
      patientName: string;
      insuranceName: string;
      coverageLevel: string;
      validUntil: string;
      statusMessage: string;
    }
  }>(null);

  const handleVerify = () => {
    // Simulation d'une vérification
    if (patientId && insuranceNumber) {
      // Dans une vraie application, ce serait un appel API
      setTimeout(() => {
        setVerificationResult({
          valid: true,
          details: {
            patientName: "Jean Dupont",
            insuranceName: "Assurance Maladie + MGEN",
            coverageLevel: "Premium",
            validUntil: "31/12/2023",
            statusMessage: "Couverture active et à jour"
          }
        });
      }, 1000);
    } else {
      setVerificationResult({
        valid: false
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex items-start">
          <ShieldCheck className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Vérifiez la couverture d'assurance des patients en temps réel. 
            Saisissez l'identifiant du patient et le numéro d'assurance.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="patientId">ID du patient</Label>
          <Input 
            id="patientId" 
            placeholder="Saisissez l'ID ou recherchez un patient" 
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insuranceNumber">Numéro d'assurance</Label>
          <Input 
            id="insuranceNumber" 
            placeholder="Ex: 1 98 05 75 123 456 78" 
            value={insuranceNumber}
            onChange={(e) => setInsuranceNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleVerify} className="w-full max-w-xs">
          <Search className="h-4 w-4 mr-2" />
          Vérifier la couverture
        </Button>
      </div>

      {verificationResult && (
        <Card className={`mt-6 ${verificationResult.valid ? 'border-green-200' : 'border-red-200'}`}>
          <CardContent className="pt-6">
            {!verificationResult.valid ? (
              <div className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>Informations d'assurance invalides ou insuffisantes.</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span className="font-medium">Couverture validée</span>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="flex items-center text-sm font-medium text-gray-500 mb-1">
                      <User className="h-4 w-4 mr-1" />
                      Patient
                    </h4>
                    <p className="font-medium">{verificationResult.details?.patientName}</p>
                  </div>
                  
                  <div>
                    <h4 className="flex items-center text-sm font-medium text-gray-500 mb-1">
                      <ShieldCheck className="h-4 w-4 mr-1" />
                      Assurance
                    </h4>
                    <p className="font-medium">{verificationResult.details?.insuranceName}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Niveau de couverture</h4>
                    <p className="font-medium">{verificationResult.details?.coverageLevel}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Valide jusqu'au</h4>
                    <p className="font-medium">{verificationResult.details?.validUntil}</p>
                  </div>
                </div>

                <Separator />

                <div className="bg-green-50 p-3 rounded-md">
                  <div className="flex items-start">
                    <FileText className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-green-700">
                      {verificationResult.details?.statusMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InsuranceVerification;
