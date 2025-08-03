import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useStepCounter } from '../hooks/useStepCounter';

export default function Dashboard() {
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
    resetDaily
  } = useStepCounter();

  const handleTrackingToggle = async () => {
    if (isTracking) {
      stopTracking();
    } else {
      if (!permissionGranted) {
        await requestPermissions();
      }
      await startTracking();
    }
  };

  const handleAddSteps = () => {
    Alert.alert(
      'Add Steps',
      'How many steps would you like to add?',
      [
        { text: '100', onPress: () => addSteps(100) },
        { text: '500', onPress: () => addSteps(500) },
        { text: '1000', onPress: () => addSteps(1000) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Daily Steps',
      'Are you sure you want to reset your daily progress?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetDaily }
      ]
    );
  };

  const progressPercentage = Math.min((stepData.steps / 10000) * 100, 100);

  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing Bolta Mobile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Bolta Mobile</Text>
        <Text style={styles.subtitle}>Step Tracking & Rewards</Text>
        
        {/* Main Step Counter */}
        <View style={styles.mainCounterContainer}>
          <View style={[styles.progressRing, { borderColor: progressPercentage > 0 ? '#10B981' : '#E5E7EB' }]}>
            <Text style={styles.stepCount}>{stepData.steps.toLocaleString()}</Text>
            <Text style={styles.stepLabel}>steps</Text>
            <Text style={styles.goalText}>Goal: 10,000</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stepData.coins}</Text>
            <Text style={styles.statLabel}>🪙 Coins</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stepData.distance}</Text>
            <Text style={styles.statLabel}>📏 Distance (km)</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stepData.calories}</Text>
            <Text style={styles.statLabel}>🔥 Calories</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{Math.round(progressPercentage)}%</Text>
            <Text style={styles.statLabel}>🎯 Goal Progress</Text>
          </View>
        </View>

        {/* Status Messages */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>⚠️ {error}</Text>
          </View>
        )}

        {!permissionGranted && (
          <View style={styles.warningContainer}>
            <Text style={styles.warning}>
              📱 Motion permissions needed for step tracking
            </Text>
          </View>
        )}

        {/* Control Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.primaryButton,
              isTracking ? styles.stopButton : styles.startButton
            ]}
            onPress={handleTrackingToggle}
          >
            <Text style={styles.buttonText}>
              {isTracking ? '⏸️ Stop Tracking' : '▶️ Start Tracking'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={handleAddSteps}
          >
            <Text style={styles.buttonText}>➕ Add Steps (Test)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.dangerButton]}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>🔄 Reset Daily</Text>
          </TouchableOpacity>
        </View>

        {/* Status Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Status: {isTracking ? '🟢 Tracking Active' : '🔴 Tracking Stopped'}
          </Text>
          <Text style={styles.footerText}>
            Last Updated: {stepData.lastUpdated.toLocaleTimeString()}
          </Text>
          <Text style={styles.footerText}>
            Source: {stepData.source}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#3B82F6',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#6b7280',
  },
  mainCounterContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  stepLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 5,
  },
  goalText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderColor: '#fecaca',
    borderWidth: 1,
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    fontSize: 14,
  },
  warningContainer: {
    backgroundColor: '#fffbeb',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderColor: '#fed7aa',
    borderWidth: 1,
  },
  warning: {
    color: '#d97706',
    textAlign: 'center',
    fontSize: 14,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  startButton: {
    backgroundColor: '#10B981',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  secondaryButton: {
    backgroundColor: '#6366f1',
  },
  dangerButton: {
    backgroundColor: '#f59e0b',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 3,
  },
});