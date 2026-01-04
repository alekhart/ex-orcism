import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const breakupQuotes = [
  "Their loss. Literally. You're amazing.",
  "Plot twist: You're the main character now.",
  "New phone, who dis? (It's your future self, thriving)",
  "They'll regret this during your glow-up montage.",
  "Congratulations on your freedom!",
  "Breaking news: You just became everyone's type.",
  "The trash took itself out. Very eco-friendly.",
  "You're not single. You're romantically self-employed.",
];

const destructionMethods = [
  { name: "🔥 Burn It", emoji: "🔥", verb: "incinerated", colors: ['#f97316', '#dc2626'] },
  { name: "🕳️ Black Hole", emoji: "🌀", verb: "consumed by the void", colors: ['#581c87', '#000000'] },
  { name: "🚀 Launch to Space", emoji: "🚀", verb: "yeeted into orbit", colors: ['#2563eb', '#9333ea'] },
  { name: "🦈 Feed to Sharks", emoji: "🦈", verb: "fed to sharks", colors: ['#38bdf8', '#1d4ed8'] },
  { name: "⚡ Smite", emoji: "⚡", verb: "smote by divine justice", colors: ['#facc15', '#d97706'] },
];

const pettyAffirmations = [
  "Their Spotify Wrapped is probably just sad acoustic covers now.",
  "Your revenge body is coming. Or not. You're hot either way.",
  "They're going to see you thriving and choke on their smoothie.",
  "Somewhere, their plants are dying without your nurturing energy.",
  "Their future partners will never match your elite meme game.",
  "You were the plot. They were just a filler episode.",
];

export default function App() {
  const [stage, setStage] = useState('input');
  const [exName, setExName] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [quote, setQuote] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [ritualProgress, setRitualProgress] = useState(0);

  // Animations
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Floating animation for header
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Shake animation during ritual
  useEffect(() => {
    if (stage === 'ritual' && ritualProgress > 50) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 5,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -5,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [stage, ritualProgress]);

  const startRitual = async (method) => {
    if (!exName.trim()) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMethod(method);
    setStage('ritual');
    setRitualProgress(0);
    fadeAnim.setValue(1);
    scaleAnim.setValue(1);
  };

  // Ritual progress
  useEffect(() => {
    if (stage === 'ritual') {
      const interval = setInterval(async () => {
        setRitualProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            completeRitual();
            return 100;
          }
          // Haptic feedback at intervals
          if (prev % 20 === 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const completeRitual = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Fade out animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStage('destroyed');
      setQuote(breakupQuotes[Math.floor(Math.random() * breakupQuotes.length)]);
    });
  };

  const getPettyAffirmation = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAffirmation(pettyAffirmations[Math.floor(Math.random() * pettyAffirmations.length)]);
    setStage('affirmation');
  };

  const reset = () => {
    setStage('input');
    setExName('');
    setSelectedMethod(null);
    setQuote('');
    setAffirmation('');
    setRitualProgress(0);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <Animated.View style={[styles.header, { transform: [{ translateY: floatAnim }] }]}>
          <Text style={styles.title}>👻 Ex-Orcism 👻</Text>
          <Text style={styles.subtitle}>Banish your ex to the shadow realm (emotionally)</Text>
        </Animated.View>

        {/* Input Stage */}
        {stage === 'input' && (
          <View style={styles.inputContainer}>
            <View style={styles.inputCard}>
              <Text style={styles.label}>Enter the name of your ex (for ceremonial purposes only)</Text>
              <TextInput
                style={styles.textInput}
                value={exName}
                onChangeText={setExName}
                placeholder="Their name here..."
                placeholderTextColor="#9ca3af"
              />
            </View>

            {exName.trim() !== '' && (
              <View style={styles.methodsContainer}>
                <Text style={styles.methodsLabel}>Choose your destruction method:</Text>
                {destructionMethods.map((method) => (
                  <TouchableOpacity
                    key={method.name}
                    style={[styles.methodButton, { backgroundColor: method.colors[0] }]}
                    onPress={() => startRitual(method)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.methodButtonText}>{method.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Ritual Stage */}
        {stage === 'ritual' && selectedMethod && (
          <View style={styles.ritualContainer}>
            <Animated.Text 
              style={[
                styles.ritualEmoji,
                { transform: [{ translateX: shakeAnim }] }
              ]}
            >
              {selectedMethod.emoji}
            </Animated.Text>
            <Animated.Text 
              style={[
                styles.ritualName,
                { 
                  transform: [{ translateX: shakeAnim }],
                  opacity: fadeAnim,
                }
              ]}
            >
              {exName}
            </Animated.Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${ritualProgress}%`, backgroundColor: selectedMethod.colors[0] }]} />
            </View>
            <Text style={styles.progressText}>Performing ex-orcism ritual... {ritualProgress}%</Text>
          </View>
        )}

        {/* Destroyed Stage */}
        {stage === 'destroyed' && selectedMethod && (
          <View style={styles.destroyedContainer}>
            <Text style={styles.destroyedEmoji}>✨</Text>
            <Text style={styles.destroyedTitle}>Successfully {selectedMethod.verb}!</Text>
            <Text style={styles.quoteText}>{quote}</Text>

            <TouchableOpacity style={styles.pettyButton} onPress={getPettyAffirmation}>
              <Text style={styles.buttonText}>💅 Get Petty Affirmation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={reset}>
              <Text style={styles.buttonText}>🔄 Exorcise Another</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Affirmation Stage */}
        {stage === 'affirmation' && (
          <View style={styles.affirmationContainer}>
            <Text style={styles.affirmationEmoji}>💅</Text>
            <View style={styles.affirmationCard}>
              <Text style={styles.affirmationText}>{affirmation}</Text>
            </View>

            <TouchableOpacity style={styles.pettyButton} onPress={getPettyAffirmation}>
              <Text style={styles.buttonText}>💅 Another One</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={reset}>
              <Text style={styles.buttonText}>🔄 Start Over</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>No exes were actually harmed in this ritual.</Text>
          <Text style={styles.footerText}>For entertainment purposes only. Please process emotions healthily. 💜</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1025',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#c084fc',
  },
  inputContainer: {
    gap: 20,
  },
  inputCard: {
    backgroundColor: 'rgba(55, 48, 71, 0.5)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  label: {
    color: '#c084fc',
    fontSize: 14,
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  methodsContainer: {
    gap: 12,
  },
  methodsLabel: {
    color: '#c084fc',
    textAlign: 'center',
    marginBottom: 5,
  },
  methodButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  methodButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  ritualContainer: {
    alignItems: 'center',
    gap: 20,
  },
  ritualEmoji: {
    fontSize: 80,
  },
  ritualName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressBar: {
    width: '80%',
    height: 16,
    backgroundColor: '#374151',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  progressText: {
    color: '#c084fc',
    fontSize: 16,
  },
  destroyedContainer: {
    alignItems: 'center',
    gap: 16,
  },
  destroyedEmoji: {
    fontSize: 80,
  },
  destroyedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ade80',
    textAlign: 'center',
  },
  quoteText: {
    fontSize: 18,
    color: '#e9d5ff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pettyButton: {
    backgroundColor: '#a855f7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#374151',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  affirmationContainer: {
    alignItems: 'center',
    gap: 16,
  },
  affirmationEmoji: {
    fontSize: 80,
  },
  affirmationCard: {
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
  },
  affirmationText: {
    fontSize: 18,
    color: '#fbcfe8',
    textAlign: 'center',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
  },
});
