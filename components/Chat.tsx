import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useChatGpt } from 'react-native-chatgpt';
import { Snackbar } from 'react-native-paper';
import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MicrophoneIcon } from 'react-native-heroicons/outline';
import { startRecording, stopRecording } from '../lib/recording';
import { transcribeAudio } from '../lib/whisper';
import getStringFromStorage from '../lib/storage/getStringFromStorage';
import { Audio } from 'expo-av';

const CHAT_GPT_THUMBNAIL_URL =
    'https://styles.redditmedia.com/t5_7hqomg/styles/communityIcon_yyc98alroh5a1.jpg?width=256&s=cb48e1046acd79d1cc52b59b34ae56b0c1a9b4b8';
const CHAT_GPT_ID = 'CHAT_GPT_ID';

const createBotMessage = (text: string) => {
    return {
        _id: String(Date.now()),
        text,
        createdAt: new Date(),
        user: {
            _id: CHAT_GPT_ID,
            name: 'react-native-chatgpt',
            avatar: CHAT_GPT_THUMBNAIL_URL,
        },
    };
};

const Chat = () => {
    const { sendMessage } = useChatGpt();
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const messageId = useRef('');
    const conversationId = useRef('');
    const [recording, setRecording] = useState<Audio.Recording | null>(null); // Add a state to manage the recording object

    const [isRecording, setIsRecording] = useState(false); // Add a state to manage recording status

    useEffect(() => {
        setMessages([createBotMessage('Ask me anything :)')]);
    }, []);

    useEffect(() => {
        if (messages.length) {
            const lastMessage = messages[0];
            if (!lastMessage || lastMessage.user._id === CHAT_GPT_ID) return;

            setMessages((prevMessages) => [createBotMessage('...'), ...prevMessages]);
        }
    }, [messages]);

    useEffect(() => {
        const lastMessage = messages[0];
        if (
            lastMessage &&
            lastMessage.user._id === CHAT_GPT_ID &&
            lastMessage.text === '...'
        ) {
            sendMessage({
                message: messages[1]?.text as string,
                options:
                    messageId.current && conversationId.current
                        ? {
                            messageId: messageId.current,
                            conversationId: conversationId.current,
                        }
                        : undefined,
                onAccumulatedResponse: (accumulatedResponse) => {
                    messageId.current = accumulatedResponse.messageId;
                    conversationId.current = accumulatedResponse.conversationId;
                    // Attach to last message
                    setMessages((previousMessages) => {
                        const newMessages = [...previousMessages];
                        // @ts-ignore
                        newMessages[0] = {
                            ...previousMessages[0],
                            text: accumulatedResponse.message,
                        };
                        return newMessages;
                    });
                },
                onError: (e) => {
                    setErrorMessage(`${e.statusCode} ${e.message}`);
                    setMessages((previousMessages) => {
                        const newMessages = [...previousMessages];
                        // @ts-ignore
                        newMessages[0] = {
                            ...previousMessages[0],
                            text: "Sorry, I couldn't process your request",
                        };
                        return newMessages;
                    });
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    const onSend = useCallback((msgs: IMessage[] = []) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, msgs)
        );
    }, []);

    // Implement the onPress event for the microphone icon
    const handlePressMicrophone = async () => {
        const apiKey = await getStringFromStorage('apiKey');
        if (!isRecording) {
            setIsRecording(true);
            const newRecording = await startRecording();
            setRecording(newRecording); // Save the recording object
        } else {
            setIsRecording(false);
            if (recording) {
                const audioUri = await stopRecording(recording); // Pass the recording object

                if (audioUri) {
                    const transcribedText = await transcribeAudio(audioUri, apiKey); // Transcribe the audio using Whisper
                    if (transcribedText) {
                        onSend([{ _id: Date.now(), text: transcribedText, createdAt: new Date(), user: { _id: 1 } }]);
                    }
                }
            }
        }
    };
    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{
                    _id: 1,
                }}
                renderInputToolbar={() => (
                    <View style={styles.microphoneContainer}>
                        <TouchableOpacity onPress={handlePressMicrophone}>
                            <MicrophoneIcon
                                size={48}
                                color={isRecording ? 'red' : 'black'}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            />
            <Snackbar
                visible={!!errorMessage}
                onDismiss={() => setErrorMessage('')}
                style={[
                    styles.snackbar,
                    { top: -Dimensions.get('window').height + insets.top + 32 },
                ]}
                duration={3000}
            >
                {errorMessage}
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    snackbar: {
        backgroundColor: 'red',
        position: 'absolute',
        left: 0,
        right: 0,
    },
    microphoneContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default Chat;