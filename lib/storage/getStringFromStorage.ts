import AsyncStorage from '@react-native-async-storage/async-storage';

const getStringFromStorage = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log(`Retrieved "${value}" from storage with key "${key}"`);
    return value;
  } catch (error) {
    console.error(
      `Error retrieving value from storage with key "${key}": ${error}`
    );
    return null;
  }
};

export default getStringFromStorage;
