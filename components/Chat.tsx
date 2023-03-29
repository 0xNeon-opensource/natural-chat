import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import helloGpt from '../lib/storage/aiChat';

const Chat = () => {
    const [message, setMessage] = useState('');

    // Dummy data for messages list
    const messages = [
        { id: '1', text: 'Hello!' },
        { id: '2', text: 'Hi, how are you?' },
        { id: '3', text: 'Good, thanks for asking!' },
    ];

    const sendMessage = () => {
        console.log('Message:', message);
        helloGpt();
        // Here you would add code to handle sending the message
        setMessage('');
    };

    return (
        <View className="flex-1">
            {/* Messages list */}
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View className="bg-gray-200 m-2 p-2 rounded">
                        <Text>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            {/* Input and button */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="w-full bg-white border-t border-gray-300 absolute bottom-0 left-0 p-2"
            >
                <View className="flex-row items-center">
                    <TextInput
                        className="flex-1 bg-gray-100 p-2 rounded"
                        placeholder="Type your message..."
                        onChangeText={setMessage}
                        value={message}
                    />
                    <TouchableOpacity
                        className="bg-blue-500 ml-2 p-2 rounded"
                        onPress={sendMessage}
                    >
                        <Text className="text-white font-bold">Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default Chat;
