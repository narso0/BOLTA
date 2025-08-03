import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, Target, TrendingUp, Calendar } from 'lucide-react';
import { useStepCounter } from '@/hooks/useStepCounter';

interface DashboardProps {
  user: { name: string; email: string };
}

const Dashboard = ({ user }: DashboardProps) => {
  const { stepData } = useStepCounter();
  const [streak, setStreak] = useState(3); // Demo streak
  
  const dailyGoal = 10000;
  const progressPercentage = Math.min((stepData.steps / dailyGoal) * 100, 100);
  
  // Weekly data with today's steps updating in real-time
  const [weeklyData, setWeeklyData] = useState(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentDayIndex = today === 0 ? 6 : today - 1; // Convert to our Mon-Sun format
    
    return days.map((day, index) => ({
      day,
      steps: index === currentDayIndex ? stepData.steps : Math.floor(Math.random() * 12000) + 3000,
      isToday: index === currentDayIndex
    }));
  });

  // Update today's steps in weekly data
  useEffect(() => {
    const today = new Date().getDay();
    const currentDayIndex = today === 0 ? 6 : today - 1;
    weeklyData[currentDayIndex].steps = stepData.steps;
  }, [stepData.steps]);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Hello, {user.name}! 👋
        </h2>
        <p className="text-muted-foreground">Keep walking towards your healthy goals</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-accent to-accent-light text-accent-foreground border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 text-sm font-medium">Today's Coins</p>
                <p className="text-3xl font-bold flex items-center gap-2">
                  {stepData.coins}
                  <Coins className="h-6 w-6 animate-coin-spin" />
                </p>
              </div>
              <div className="text-2xl">🪙</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success to-primary text-success-foreground border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success-foreground/80 text-sm font-medium">Streak</p>
                <p className="text-3xl font-bold">{streak} days</p>
              </div>
              <Calendar className="h-8 w-8 text-success-foreground/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* This Week */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((day, index) => {
              const dayProgress = Math.min((day.steps / dailyGoal) * 100, 100);
              const isGoalReached = day.steps >= dailyGoal;
              
              return (
                <div key={index} className="text-center space-y-2">
                  <p className={`text-xs font-medium ${isGoalReached ? 'text-success' : 'text-muted-foreground'}`}>
                    {day.day}
                  </p>
                  <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                    <div className="h-16 bg-muted/50 rounded relative overflow-hidden">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-success rounded transition-all duration-300"
                        style={{ height: `${dayProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(day.steps / 1000)}k
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Goal */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Daily Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">{stepData.steps.toLocaleString()} / {dailyGoal.toLocaleString()}</span>
            </div>
            <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-success rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {stepData.steps < dailyGoal 
                  ? `${(dailyGoal - stepData.steps).toLocaleString()} steps to reach goal` 
                  : 'Daily goal completed! 🎉'
                }
              </p>
              {stepData.steps >= dailyGoal && (
                <Badge variant="secondary" className="bg-success text-success-foreground">
                  Goal Achieved!
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Earn */}
      <Card className="border-0 shadow-soft bg-muted/30">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">How You Earn Boltacoins</h3>
            <p className="text-muted-foreground">
              Every 1,000 steps = 1 Boltacoin • Use coins for discounts at healthy stores & gyms
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-primary font-medium">1K steps</span>
              </div>
              <span>=</span>
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-accent" />
                <span className="text-accent font-medium">1 coin</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;