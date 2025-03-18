
import React from 'react';
import { Search, Bell, Mail, User, Key, Languages, Shield, Building2, Headphones, Globe, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center w-72">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-neotech-primary text-white rounded-full text-xs flex items-center justify-center">
              2
            </span>
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Mail size={20} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-neotech-primary text-white rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </Button>

          <div className="flex items-center pl-4 border-l border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-neotech-primary text-white">
                      A
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@neotech-consulting.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Profile Settings */}
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => navigate('/profile?tab=password')}
                  >
                    <Key className="h-4 w-4" />
                    <span>Mot de passe</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => navigate('/profile?tab=language')}
                  >
                    <Languages className="h-4 w-4" />
                    <span>Langue</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => navigate('/profile?tab=2fa')}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Authentification</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                {/* Module Categories */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>Gestion d'Entreprise</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Companies
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Employees
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Accounting
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Purchase
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Inventory
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Planning
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Projects
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <Headphones className="h-4 w-4 mr-2" />
                    <span>Services Spécialisés</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        POS
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Garage
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Transport
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Health
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Hotel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Bookstore
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>Présence Numérique</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Website
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Ecommerce
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Email Marketing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Academy
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Elearning
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>Communication</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Messages
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/applications')}>
                        Documents
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive">
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="ml-2 font-medium text-sm">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
