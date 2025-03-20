
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Heart, Activity, LucideStethoscope } from "lucide-react";
import { useConsultationForm } from "../../context/ConsultationFormContext";

const VitalSignsTab: React.FC = () => {
  const { form } = useConsultationForm();

  if (!form) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Thermometer className="mr-2 h-4 w-4 text-red-500" />
            Température
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center">
                  <FormControl>
                    <Input {...field} type="number" step="0.1" placeholder="37.0" />
                  </FormControl>
                  <span className="ml-2">°C</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Heart className="mr-2 h-4 w-4 text-red-500" />
            Fréquence cardiaque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="heartRate"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center">
                  <FormControl>
                    <Input {...field} type="number" placeholder="75" />
                  </FormControl>
                  <span className="ml-2">bpm</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Activity className="mr-2 h-4 w-4 text-red-500" />
            Tension artérielle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="systolic"
              render={({ field }) => (
                <FormItem className="space-y-1 flex-1">
                  <FormControl>
                    <Input {...field} type="number" placeholder="120" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="mt-2">/</span>
            <FormField
              control={form.control}
              name="diastolic"
              render={({ field }) => (
                <FormItem className="space-y-1 flex-1">
                  <FormControl>
                    <Input {...field} type="number" placeholder="80" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="mt-2">mmHg</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <LucideStethoscope className="mr-2 h-4 w-4 text-blue-500" />
            Fréquence respiratoire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="respiratoryRate"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center">
                  <FormControl>
                    <Input {...field} type="number" placeholder="16" />
                  </FormControl>
                  <span className="ml-2">resp/min</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Activity className="mr-2 h-4 w-4 text-blue-500" />
            Saturation en oxygène
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="oxygenSaturation"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center">
                  <FormControl>
                    <Input {...field} type="number" placeholder="98" />
                  </FormControl>
                  <span className="ml-2">%</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Douleur (0-10)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="pain"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <Input {...field} type="number" min="0" max="10" placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Taille
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center">
                  <FormControl>
                    <Input {...field} type="number" placeholder="170" />
                  </FormControl>
                  <span className="ml-2">cm</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Poids
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center">
                  <FormControl>
                    <Input {...field} type="number" placeholder="70" />
                  </FormControl>
                  <span className="ml-2">kg</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default VitalSignsTab;
