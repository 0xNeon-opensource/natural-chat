import AsyncStorage from '@react-native-async-storage/async-storage';

const saveStringToStorage = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(`Saved "${value}" to storage with key "${key}"`);
  } catch (error) {
    console.error(
      `Error saving "${value}" to storage with key "${key}": ${error}`
    );
  }
};

export default saveStringToStorage;
