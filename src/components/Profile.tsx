import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Coins, Trophy, Calendar, Mail, Settings, MapPin, Activity } from 'lucide-react';
import { useStepCounter } from '@/hooks/useStepCounter';

interface ProfileProps {
  user: { name: string; email: string };
}

const Profile = ({ user }: ProfileProps) => {
  const { stepData } = useStepCounter();
  
  const userData = {
    name: user.name,
    email: user.email,
    joinDate: "January 2024",
    totalSteps: stepData.steps,
    totalCoins: stepData.coins,
    coinsSpent: 12,
    distance: stepData.distance,
    achievements: [
      { name: "First Steps", description: "Walked your first 1,000 steps", earned: stepData.steps >= 1000 },
      { name: "Coin Collector", description: "Earned 5 Boltacoins", earned: stepData.coins >= 5 },
      { name: "Goal Crusher", description: "Reached daily goal", earned: stepData.steps >= 10000 },
      { name: "Distance Walker", description: "Walked 5 kilometers", earned: stepData.distance >= 5 },
      { name: "Marathon Walker", description: "Walked 50,000 total steps", earned: stepData.steps >= 50000 }
    ]
  };

  const weeklyStats = [
    { day: "Mon", steps: 8450, coins: 8 },
    { day: "Tue", steps: 12300, coins: 12 },
    { day: "Wed", steps: 9800, coins: 9 },
    { day: "Thu", steps: 11200, coins: 11 },
    { day: "Fri", steps: 10500, coins: 10 },
    { day: "Sat", steps: 15600, coins: 15 },
    { day: "Sun", steps: stepData.steps, coins: stepData.coins }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{userData.name}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {userData.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {userData.joinDate}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{userData.totalSteps}</p>
            <p className="text-sm text-muted-foreground">Total Steps</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Coins className="h-6 w-6 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground">{userData.totalCoins}</p>
            <p className="text-sm text-muted-foreground">Total Coins Earned</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-6 w-6 text-success" />
            </div>
            <p className="text-2xl font-bold text-foreground">{userData.coinsSpent}</p>
            <p className="text-sm text-muted-foreground">Coins Spent</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{userData.distance} km</p>
            <p className="text-sm text-muted-foreground">Distance Walked</p>
          </CardContent>
        </Card>
      </div>

      {/* This Week's Activity */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-foreground">This Week's Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyStats.map((day, index) => (
              <div key={index} className="text-center space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{day.day}</p>
                <div className="bg-muted/30 rounded-lg p-3 space-y-1">
                  <p className="text-sm font-semibold text-foreground">{day.steps.toLocaleString()}</p>
                  <div className="flex items-center justify-center gap-1">
                    <Coins className="h-3 w-3 text-accent" />
                    <span className="text-xs text-accent font-medium">{day.coins}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Trophy className="h-5 w-5 text-success" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {userData.achievements.map((achievement, index) => (
            <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${achievement.earned ? 'bg-success/10' : 'bg-muted/30'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                <Trophy className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {achievement.name}
                </p>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
              {achievement.earned && (
                <Badge className="bg-success text-success-foreground">
                  Earned
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;