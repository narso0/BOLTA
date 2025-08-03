import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Target, TrendingUp, Calendar, Award, Zap, AlertCircle } from 'lucide-react';
import { useStepCounter } from '@/hooks/useStepCounter';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface User {
  name: string;
  email: string;
}

interface DashboardProps {
  user: User;
}

interface WeeklyDataPoint {
  day: string;
  steps: number;
  isToday: boolean;
  date: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  achieved: boolean;
  progress: number;
  requirement: number;
}

// Constants
const DAILY_GOAL = 10000;
const WEEKLY_GOAL = 70000; // 7 days * 10k steps
const ACHIEVEMENT_THRESHOLDS = {
  FIRST_STEPS: 100,
  DAILY_GOAL: 10000,
  WEEK_WARRIOR: 70000,
  COIN_COLLECTOR: 10,
  DISTANCE_WALKER: 5 // 5km
};

// Memoized components for better performance
const StatCard = memo(({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = "text-foreground" 
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: string;
  color?: string;
}) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
      {trend && (
        <p className="text-xs text-green-600 font-medium">{trend}</p>
      )}
    </CardContent>
  </Card>
));

const WeeklyChart = memo(({ data }: { data: WeeklyDataPoint[] }) => {
  const maxSteps = useMemo(() => 
    Math.max(...data.map(d => d.steps), DAILY_GOAL), 
    [data]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((day, index) => (
            <div key={day.day} className="flex items-center gap-3">
              <div className="w-8 text-sm font-medium">
                {day.day}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">
                    {day.steps.toLocaleString()} steps
                  </span>
                  {day.isToday && (
                    <Badge variant="secondary" className="text-xs">
                      Today
                    </Badge>
                  )}
                </div>
                <Progress 
                  value={(day.steps / maxSteps) * 100} 
                  className="h-2"
                />
              </div>
              <div className="w-12 text-right text-sm">
                {Math.round((day.steps / DAILY_GOAL) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

const AchievementCard = memo(({ achievement }: { achievement: Achievement }) => (
  <Card className={`transition-all duration-200 ${
    achievement.achieved 
      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
      : 'hover:shadow-md'
  }`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${
          achievement.achieved 
            ? 'bg-green-100 text-green-600' 
            : 'bg-gray-100 text-gray-400'
        }`}>
          <achievement.icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm">{achievement.title}</h4>
          <p className="text-xs text-muted-foreground">{achievement.description}</p>
          {!achievement.achieved && (
            <Progress 
              value={(achievement.progress / achievement.requirement) * 100} 
              className="h-1 mt-2"
            />
          )}
        </div>
        {achievement.achieved && (
          <Award className="h-5 w-5 text-green-600" />
        )}
      </div>
    </CardContent>
  </Card>
));

const Dashboard = ({ user }: DashboardProps) => {
  const { 
    stepData, 
    isTracking, 
    error, 
    isInitialized,
    startTracking,
    resetDailyData 
  } = useStepCounter();
  
  const [streak, setStreak] = useState(3); // Demo streak - would come from backend
  const [weeklyData, setWeeklyData] = useState<WeeklyDataPoint[]>([]);

  // Memoized calculations
  const progressPercentage = useMemo(() => 
    Math.min((stepData.steps / DAILY_GOAL) * 100, 100), 
    [stepData.steps]
  );

  const weeklySteps = useMemo(() => 
    weeklyData.reduce((sum, day) => sum + day.steps, 0), 
    [weeklyData]
  );

  const weeklyProgress = useMemo(() => 
    Math.min((weeklySteps / WEEKLY_GOAL) * 100, 100), 
    [weeklySteps]
  );

  const achievements = useMemo((): Achievement[] => [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Take your first 100 steps',
      icon: Target,
      achieved: stepData.steps >= ACHIEVEMENT_THRESHOLDS.FIRST_STEPS,
      progress: stepData.steps,
      requirement: ACHIEVEMENT_THRESHOLDS.FIRST_STEPS
    },
    {
      id: 'daily-goal',
      title: 'Daily Champion',
      description: 'Reach 10,000 steps in a day',
      icon: Zap,
      achieved: stepData.steps >= ACHIEVEMENT_THRESHOLDS.DAILY_GOAL,
      progress: stepData.steps,
      requirement: ACHIEVEMENT_THRESHOLDS.DAILY_GOAL
    },
    {
      id: 'coin-collector',
      title: 'Coin Collector',
      description: 'Earn 10 Boltacoins',
      icon: Coins,
      achieved: stepData.coins >= ACHIEVEMENT_THRESHOLDS.COIN_COLLECTOR,
      progress: stepData.coins,
      requirement: ACHIEVEMENT_THRESHOLDS.COIN_COLLECTOR
    },
    {
      id: 'distance-walker',
      title: 'Distance Walker',
      description: 'Walk 5 kilometers',
      icon: TrendingUp,
      achieved: stepData.distance >= ACHIEVEMENT_THRESHOLDS.DISTANCE_WALKER,
      progress: stepData.distance,
      requirement: ACHIEVEMENT_THRESHOLDS.DISTANCE_WALKER
    }
  ], [stepData]);

  const achievedCount = useMemo(() => 
    achievements.filter(a => a.achieved).length, 
    [achievements]
  );

  // Initialize weekly data
  useEffect(() => {
    const initializeWeeklyData = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const today = new Date();
      const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
      
      const data: WeeklyDataPoint[] = days.map((day, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (currentDayIndex - index));
        
        return {
          day,
          steps: index === currentDayIndex ? stepData.steps : Math.floor(Math.random() * 12000) + 3000,
          isToday: index === currentDayIndex,
          date
        };
      });
      
      setWeeklyData(data);
    };

    if (isInitialized) {
      initializeWeeklyData();
    }
  }, [isInitialized, stepData.steps]);

  // Update today's steps in weekly data
  useEffect(() => {
    setWeeklyData(prev => 
      prev.map(day => 
        day.isToday ? { ...day, steps: stepData.steps } : day
      )
    );
  }, [stepData.steps]);

  const handleRetryTracking = useCallback(() => {
    startTracking();
  }, [startTracking]);

  const handleResetData = useCallback(() => {
    if (confirm('Are you sure you want to reset today\'s data? This action cannot be undone.')) {
      resetDailyData();
    }
  }, [resetDailyData]);

  const getMotivationalMessage = useCallback(() => {
    const percentage = progressPercentage;
    if (percentage >= 100) return "🎉 Goal achieved! You're amazing!";
    if (percentage >= 75) return "🔥 Almost there! Keep pushing!";
    if (percentage >= 50) return "💪 Great progress! You're halfway there!";
    if (percentage >= 25) return "🚀 Good start! Keep it up!";
    return "👟 Ready to start your journey?";
  }, [progressPercentage]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing step tracking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Hello, {user.name}! 👋
        </h2>
        <p className="text-muted-foreground">{getMotivationalMessage()}</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetryTracking}
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tracking Status */}
      {!isTracking && !error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Step tracking is not active. Enable it to start earning coins!</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetryTracking}
              className="ml-2"
            >
              Enable Tracking
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Steps"
          value={stepData.steps.toLocaleString()}
          subtitle={`${Math.round(progressPercentage)}% of daily goal`}
          icon={Target}
          trend={stepData.steps > 0 ? `+${stepData.steps} today` : undefined}
          color="text-blue-600"
        />
        
        <StatCard
          title="Boltacoins"
          value={stepData.coins}
          subtitle="Earned from walking"
          icon={Coins}
          color="text-yellow-600"
        />
        
        <StatCard
          title="Distance"
          value={`${stepData.distance} km`}
          subtitle="Total distance today"
          icon={TrendingUp}
          color="text-green-600"
        />
        
        <StatCard
          title="Calories"
          value={stepData.calories}
          subtitle="Calories burned"
          icon={Zap}
          color="text-red-600"
        />
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Daily Goal Progress
              </span>
              <Badge variant={progressPercentage >= 100 ? "default" : "secondary"}>
                {Math.round(progressPercentage)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{stepData.steps.toLocaleString()} steps</span>
              <span>{DAILY_GOAL.toLocaleString()} goal</span>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {DAILY_GOAL - stepData.steps > 0 
                  ? `${(DAILY_GOAL - stepData.steps).toLocaleString()} steps to go!`
                  : "🎉 Daily goal achieved!"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Summary
              </span>
              <Badge variant={weeklyProgress >= 100 ? "default" : "secondary"}>
                {Math.round(weeklyProgress)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekly Steps</span>
                <span className="font-medium">{weeklySteps.toLocaleString()}</span>
              </div>
              <Progress value={weeklyProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Goal: {WEEKLY_GOAL.toLocaleString()}</span>
                <span>{streak} day streak 🔥</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      <WeeklyChart data={weeklyData} />

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </span>
            <Badge variant="outline">
              {achievedCount}/{achievements.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map(achievement => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Debug/Admin Actions */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Debug Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetData}
              >
                Reset Today's Data
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetryTracking}
              >
                Restart Tracking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default memo(Dashboard);