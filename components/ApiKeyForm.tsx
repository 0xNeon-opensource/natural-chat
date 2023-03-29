import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import saveStringToStorage from '../lib/storage/saveStringToStorage';

type ApiKeyFormProps = {
    onApiKeySubmit: (apiKey: string) => void;
};

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onApiKeySubmit }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = useCallback(() => {
        onApiKeySubmit(apiKey);
        saveStringToStorage('apiKey', apiKey)
    }, [apiKey, onApiKeySubmit]);

    return (
        <View className='flex-1 justify-center items-center'>
            <Text className='text-white'>Welcome to natural-chat!</Text>

            <View className='w-full px-4'>
                <TextInput
                    className=' p-2 rounded text-white placeholder:text-gray-300'
                    placeholder="Enter OpenAI API Key"
                    onChangeText={setApiKey}
                    value={apiKey}
                    placeholderTextColor="#9CA3AF"
                    autoFocus
                />
            </View>
            <TouchableOpacity
                className='bg-teal-950 p-3 rounded mt-4'
                onPress={handleSubmit}
            >
                <Text className='text-white font-bold'>
                    Save
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ApiKeyForm;
