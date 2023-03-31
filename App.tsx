import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatGptProvider } from 'react-native-chatgpt';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ApiKeyForm from './components/ApiKeyForm';
import Chat from './components/Chat';
import Navigator from './components/Navigator';
import getStringFromStorage from './lib/storage/getStringFromStorage';

export default function App() {
  const [hasApiKey, setHasApiKey] = useState<boolean | undefined>(undefined);

  const handleApiKeySubmit = useCallback((apiKey: string) => {
    console.log('Submitted API Key:', apiKey);
    setHasApiKey(true);
  }, []);

  useEffect(() => {
    getStringFromStorage('apiKey').then((apiKey) => {
      if (apiKey) {
        setHasApiKey(true);
      } else {
        setHasApiKey(false);
      }
    });
  }, []);
  return (
    <SafeAreaProvider>
      <ChatGptProvider>
        <View className="flex-1 bg-teal-900">
          {
            hasApiKey === undefined ? (
              <Text className="text-white">Loading...</Text>) :
              hasApiKey ? (
                <Navigator />
              ) : <ApiKeyForm onApiKeySubmit={handleApiKeySubmit} />
          }
        </View>
      </ChatGptProvider>
    </SafeAreaProvider>
  );
}
