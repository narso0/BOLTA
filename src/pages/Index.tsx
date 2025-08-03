import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import Marketplace from '@/components/Marketplace';
import Profile from '@/components/Profile';
import Auth from '@/components/Auth';
import Intro from '@/components/Intro';
import { useStepCounter } from '@/hooks/useStepCounter';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const { stepData } = useStepCounter();

  const handleAuth = (userData: { name: string; email: string }) => {
    setUser(userData);
    setShowIntro(false);
  };

  const handleGetStarted = () => setShowIntro(false);
  const handleProfileClick = () => setShowProfile(true);
  const handleBackFromProfile = () => setShowProfile(false);

  if (showIntro) return <Intro onGetStarted={handleGetStarted} />;
  if (!user) return <Auth onAuth={handleAuth} />;

  if (showProfile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleBackFromProfile} className="text-primary hover:text-primary-dark">← Back</button>
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          </div>
          <Profile user={user} />
        </div>
      </div>
    );
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'marketplace': return <Marketplace />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          coinCount={stepData.coins}
          user={user}
          onProfileClick={handleProfileClick}
        />
        <main>{renderActiveComponent()}</main>
      </div>
    </div>
  );
};

export default Index;
