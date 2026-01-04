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
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

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
  { name: "🔥 Burn It", emoji: "🔥", verb: "incinerated", pastTense: "INCINERATED", colors: ['#f97316', '#dc2626'] },
  { name: "🕳️ Black Hole", emoji: "🌀", verb: "consumed by the void", pastTense: "CONSUMED BY THE VOID", colors: ['#581c87', '#000000'] },
  { name: "🚀 Launch to Space", emoji: "🚀", verb: "yeeted into orbit", pastTense: "YEETED INTO ORBIT", colors: ['#2563eb', '#9333ea'] },
  { name: "🦈 Feed to Sharks", emoji: "🦈", verb: "fed to sharks", pastTense: "FED TO SHARKS", colors: ['#38bdf8', '#1d4ed8'] },
  { name: "⚡ Smite", emoji: "⚡", verb: "smote by divine justice", pastTense: "SMOTE BY DIVINE JUSTICE", colors: ['#facc15', '#d97706'] },
];

const pettyAffirmations = [
  "Their Spotify Wrapped is probably just sad acoustic covers now.",
  "Your revenge body is coming. Or not. You're hot either way.",
  "They're going to see you thriving and choke on their smoothie.",
  "Somewhere, their plants are dying without your nurturing energy.",
  "Their future partners will never match your elite meme game.",
  "You were the plot. They were just a filler episode.",
];

// Share card templates - randomly selected
const shareCardTemplates = [
  // Celebration/Freedom
  {
    emoji: "✨",
    header: "OFFICIALLY BANISHED",
    subtext: "is no longer your problem",
  },
  {
    emoji: "🎉",
    header: "FREEDOM UNLOCKED",
    subtext: "has been removed from the narrative",
  },
  {
    emoji: "⭐",
    header: "MAIN CHARACTER STATUS RESTORED",
    subtext: "has exited the chat",
  },
  // Playful/Meme
  {
    emoji: "🚫",
    header: "BLOCKED BY THE UNIVERSE",
    subtext: "Access Denied",
  },
  {
    emoji: "📤",
    header: "SUCCESSFULLY UNSUBSCRIBED",
    subtext: "'s nonsense - No longer in your inbox",
  },
  {
    emoji: "🗑️",
    header: "RECYCLED",
    subtext: "has been composted into personal growth",
  },
  // Dramatic/Fantasy
  {
    emoji: "⚔️",
    header: "BANISHED TO THE SHADOW REALM",
    subtext: "shall not return",
  },
  {
    emoji: "🌌",
    header: "SENT TO THE VOID",
    subtext: "Status: Forgotten",
  },
  {
    emoji: "🔮",
    header: "THE SPIRITS HAVE SPOKEN",
    subtext: "has been ex-orcised",
  },
  // Petty/Funny
  {
    emoji: "👋",
    header: "BYE FOREVER",
    subtext: "It's not me, it's definitely you",
  },
  {
    emoji: "💅",
    header: "OFFICIALLY OVER IT",
    subtext: "who? Don't know them.",
  },
  {
    emoji: "🧹",
    header: "CLEANSED",
    subtext: "energy has been removed from your life",
  },
];

const getFormattedDate = () => {
  const date = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const getRandomTemplate = () => {
  return shareCardTemplates[Math.floor(Math.random() * shareCardTemplates.length)];
};

export default function App() {
  const [stage, setStage] = useState('input');
  const [exName, setExName] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [quote, setQuote] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [ritualProgress, setRitualProgress] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [cardTemplate, setCardTemplate] = useState(shareCardTemplates[0]);

  // Refs
  const shareCardRef = useRef();

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
      setCardTemplate(getRandomTemplate());
    });
  };

  const getPettyAffirmation = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAffirmation(pettyAffirmations[Math.floor(Math.random() * pettyAffirmations.length)]);
    setStage('affirmation');
  };

  const shareResult = async () => {
    try {
      setIsSharing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        alert('Sharing is not available on this device');
        setIsSharing(false);
        return;
      }

      // Capture the share card as an image
      const uri = await captureRef(shareCardRef, {
        format: 'png',
        quality: 1,
      });

      // Share the image
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your ex-orcism!',
      });
      
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Could not capture image. Try again!');
    } finally {
      setIsSharing(false);
    }
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
            
            {/* Shareable Card - This gets captured */}
            <View 
              ref={shareCardRef}
              style={styles.shareCard}
              collapsable={false}
            >
              <View style={styles.shareCardInner}>
                <Text style={styles.shareCardEmoji}>{cardTemplate.emoji}</Text>
                <Text style={styles.shareCardHeader}>{cardTemplate.header}</Text>
                <View style={styles.shareCardDivider} />
                <Text style={styles.shareCardName}>{exName.toUpperCase()}</Text>
                <Text style={styles.shareCardSubtext}>{cardTemplate.subtext}</Text>
                <View style={styles.shareCardDivider} />
                <Text style={styles.shareCardMethod}>{selectedMethod.pastTense}</Text>
                <Text style={styles.shareCardDate}>{getFormattedDate()}</Text>
                <View style={styles.shareCardFooter}>
                  <Text style={styles.shareCardBrand}>👻 Ex-Orcism</Text>
                </View>
              </View>
            </View>

            <Text style={styles.quoteText}>{quote}</Text>

            <TouchableOpacity 
              style={styles.shareButton} 
              onPress={shareResult}
              disabled={isSharing}
            >
              <Text style={styles.buttonText}>
                {isSharing ? '📤 Preparing...' : '📤 Share Your Ex-Orcism'}
              </Text>
            </TouchableOpacity>

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
  // Share Card Styles
  shareCard: {
    backgroundColor: '#1a1025',
    borderRadius: 20,
    padding: 4,
    marginBottom: 10,
  },
  shareCardInner: {
    backgroundColor: '#0f0a15',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#a855f7',
    minWidth: 280,
  },
  shareCardEmoji: {
    fontSize: 50,
    marginBottom: 8,
  },
  shareCardHeader: {
    fontSize: 14,
    color: '#c084fc',
    letterSpacing: 2,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  shareCardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 8,
  },
  shareCardSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 8,
  },
  shareCardDivider: {
    width: 60,
    height: 2,
    backgroundColor: '#a855f7',
    marginVertical: 8,
  },
  shareCardMethod: {
    fontSize: 11,
    color: '#6b7280',
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: 'center',
  },
  shareCardDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  shareCardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  shareCardBrand: {
    fontSize: 16,
    color: '#a855f7',
    fontWeight: '600',
  },
  quoteText: {
    fontSize: 18,
    color: '#e9d5ff',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  shareButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  pettyButton: {
    backgroundColor: '#a855f7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
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
