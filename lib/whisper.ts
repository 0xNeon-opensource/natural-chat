import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import base64js from 'base64-js';

export const transcribeAudio = async (audioUri: string, apiKey: string) => {
    try {
        // Read the audio file as a base64 string
        const audioData = await FileSystem.readAsStringAsync(audioUri, { encoding: FileSystem.EncodingType.Base64 });

        // Convert base64 to Blob
        const byteArray = base64js.toByteArray(audioData);
        const blob = new Blob([byteArray], { type: 'audio/wav' });

        // Custom append function to work around Blob issues
        function appendFormValue(formData, fieldName, fieldValue, fileName = 'blob') {
            if (typeof fieldValue === 'string') {
                formData.append(fieldName, fieldValue);
            } else {
                const blob = new Blob([fieldValue], { type: fieldValue.type || 'application/octet-stream' });
                formData.append(fieldName, blob, fileName || 'blob');
            }
        }

        // Create a FormData object
        const formData = new FormData();
        appendFormValue(formData, 'file', blob, 'audio.wav');
        appendFormValue(formData, 'model', 'whisper-1');
        appendFormValue(formData, 'response_format', 'text');        // Use axios to upload the audio file
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        const jsonResponse = response.data;

        if (jsonResponse.error) {
            console.error('Error transcribing audio:', jsonResponse.error.message);
            return null;
        }

        return jsonResponse.text;
    } catch (error) {
        console.error('Error transcribing audio:', error.response.data || error);
        return null;
    }
};