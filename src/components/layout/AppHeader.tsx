
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Utensils, LogOut, User, Home, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface AppHeaderProps {
  onTakeQuestionnaire?: () => void;
  onBackToDashboard?: () => void;
  showQuestionnaire?: boolean;
  hasProfile?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  onBackToDashboard,
  showQuestionnaire,
  hasProfile 
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      console.log('🚪 Starting sign out process...');
      await signOut();
      console.log('✅ Sign out successful');
      toast.success("Signed out successfully");
      // Force navigation to auth page
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('❌ Sign out error:', error);
      toast.error("Error signing out");
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleDashboardClick = () => {
    navigate('/');
  };

  const isProfilePage = location.pathname === '/profile';

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Utensils className="w-6 h-6 text-green-600" />
          <span className="font-semibold text-gray-900">NutriAI</span>
        </div>
        
        <div className="flex items-center gap-4">
          {showQuestionnaire && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToDashboard}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{user?.email}</span>
          </div>
          
          {isProfilePage ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDashboardClick}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleProfileClick}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Profile
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
