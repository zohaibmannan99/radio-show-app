import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Linking } from 'react-native';
import { Audio } from 'expo-av';

// Replace this with your actual stream URL
const STREAM_URL = 'https://streamer.radio.co/s50c2f04ea/listen';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const sound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          //interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true, // ✅ This lets it play even when silent switch is ON
          shouldDuckAndroid: true,
          //interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: false,
        });
        console.log('🎧 Audio mode configured.');
      } catch (error) {
        console.error('❌ Error configuring audio mode:', error);
      }
    };
  
    configureAudio();
  
    console.log('🔁 isPlaying changed:', isPlaying);
  }, [isPlaying]);

  const playStream = async () => {
    try {
      console.log('▶️ playStream called');
      const { sound: playbackObj } = await Audio.Sound.createAsync(
        { uri: STREAM_URL },
        { shouldPlay: true }
      );
      sound.current = playbackObj;
      setIsPlaying(true);
    } catch (error) {
      console.error('❌ Error playing stream:', error);
    }
  };

  const stopStream = async () => {
    try {
      console.log('⏹️ stopStream called');
      if (sound.current) {
        await sound.current.pauseAsync();     // Pause instead of stop
        await sound.current.unloadAsync();    // Optional: clean up
        sound.current = null;
      }
      setIsPlaying(false);
    } catch (error) {
      console.error('❌ Error stopping stream:', error);
    }
  };



  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>🎙️ Catch Some Z'z</Text>
      <Button
        key={refreshKey}
        title={isPlaying ? 'Stop' : 'Play'}
        onPress={isPlaying ? stopStream : playStream}
      />
      <Text style={styles.info}>Streaming live via Radio.co</Text>
      <Text
        style={styles.link}
        onPress={() => Linking.openURL('https://yourstation.radio.co')}>
        Web PLayer
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#111',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  info: {
    color: 'gray',
    marginTop: 20,
  },
  link: {
    color: '#1DB954',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
