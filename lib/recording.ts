import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

const recordingSettings = JSON.parse(
    JSON.stringify(Audio.RecordingOptionsPresets.HIGH_QUALITY)
);

export const startRecording = async () => {
    console.log('recording started');

    const { status } = await Audio.requestPermissionsAsync();

    if (status !== 'granted') {
        throw new Error('Audio recording permissions not granted');
    }

    // Enable recording on iOS by setting the appropriate audio mode
    await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(recordingSettings);
    await recording.startAsync();

    return recording;
};

export const stopRecording = async (recording: Audio.Recording) => {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('uri created :>> ', uri);

    return uri;
};