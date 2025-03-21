
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const ChatSupportTab: React.FC = () => {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Support Chat</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Le module de chat en direct sera implémenté dans la prochaine mise à jour.
              Il permettra une communication instantanée avec vos clients.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatSupportTab;
