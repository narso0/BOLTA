import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStepCounter } from '../hooks/useStepCounter';

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const {
    stepData,
    isTracking,
    permissionGranted,
    error,
    isInitialized,
    requestPermissions,
    startTracking,
    stopTracking,
    addSteps,
  } = useStepCounter();

  const [refreshing, setRefreshing] = useState(false);

  const dailyGoal = 10000;
  const progressPercentage = Math.min((stepData.steps / dailyGoal) * 100, 100);

  useEffect(() => {
    if (isInitialized && !permissionGranted) {
      Alert.alert(
        'Permissions Required',
        'Bolta needs access to your device sensors to track your steps.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: requestPermissions },
        ]
      );
    }
  }, [isInitialized, permissionGranted, requestPermissions]);

  const handleToggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else if (permissionGranted) {
      startTracking();
    } else {
      requestPermissions();
    }
  };

  const handleAddSteps = () => {
    Alert.prompt(
      'Add Steps Manually',
      'Enter the number of steps to add:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (value) => {
            const steps = parseInt(value || '0', 10);
            if (steps > 0) {
              addSteps(steps);
            }
          },
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    color: string;
  }> = ({ title, value, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  if (!isInitialized) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.loadingText}>Initializing Bolta...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bolta Fitness</Text>
        <Text style={styles.subtitle}>Track your daily activity</Text>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Progress Circle */}
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={['#3B82F6', '#8B5CF6']}
          style={styles.progressCircle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.progressInner}>
            <Text style={styles.stepsText}>{stepData.steps.toLocaleString()}</Text>
            <Text style={styles.stepsLabel}>steps</Text>
            <Text style={styles.goalText}>
              Goal: {dailyGoal.toLocaleString()}
            </Text>
          </View>
        </LinearGradient>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#3B82F6', '#8B5CF6']}
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progressPercentage)}%</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Coins"
          value={stepData.coins.toString()}
          color="#F59E0B"
        />
        <StatCard
          title="Distance"
          value={`${stepData.distance} km`}
          color="#10B981"
        />
        <StatCard
          title="Calories"
          value={stepData.calories.toString()}
          color="#EF4444"
        />
        <StatCard
          title="Status"
          value={isTracking ? 'Tracking' : 'Paused'}
          color={isTracking ? '#10B981' : '#6B7280'}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isTracking ? '#EF4444' : '#3B82F6' },
          ]}
          onPress={handleToggleTracking}
        >
          <Text style={styles.buttonText}>
            {isTracking ? '⏸️ Stop Tracking' : '▶️ Start Tracking'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleAddSteps}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            ➕ Add Steps
          </Text>
        </TouchableOpacity>
      </View>

      {/* Achievement Preview */}
      <View style={styles.achievementContainer}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <View style={styles.achievementCard}>
          <Text style={styles.achievementIcon}>🏆</Text>
          <View style={styles.achievementText}>
            <Text style={styles.achievementTitle}>
              {stepData.steps >= dailyGoal
                ? '🎉 Daily Goal Achieved!'
                : `${dailyGoal - stepData.steps} steps to go!`}
            </Text>
            <Text style={styles.achievementSubtitle}>
              {stepData.steps >= dailyGoal
                ? 'Great job! You reached your daily goal.'
                : 'Keep walking to reach your daily goal.'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    margin: 20,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressInner: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  stepsLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  progressBarContainer: {
    width: width * 0.8,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  secondaryButtonText: {
    color: '#3B82F6',
  },
  achievementContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default DashboardScreen;