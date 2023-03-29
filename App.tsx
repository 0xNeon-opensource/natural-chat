import { StyleSheet, Text, View } from 'react-native';
import ApiKeyForm from './components/ApiKeyForm';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <Text>Open up App.tsx to start working on your app!</Text>
      <ApiKeyForm onApiKeySubmit={() => null} />
    </View>
  );
}
