import React, { useRef, useState } from 'react';
import AudioPlayer from './AudioPlayer';
import Transcript from './Transcript';

const Recorder = ({ onSendAudio }) => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcriptLines, setTranscriptLines] = useState([]); // Finalized lines
  const [interimTranscript, setInterimTranscript] = useState(''); // Live speaking text

  const startRecording = async () => {
    setIsRecording(true);
    setTranscriptLines([]);
    setInterimTranscript('');

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      const finalized = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalized.push(result[0].transcript.trim());
        } else {
          interim += result[0].transcript + ' ';
        }
      }

      if (finalized.length > 0) {
        setTranscriptLines((prev) => [...prev, ...finalized]);
        setInterimTranscript(''); // Clear interim once finalized
      }

      if (interim) {
        setInterimTranscript(interim.trim());
      }
    };

    recognition.start();

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      recognition.stop();

      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(blob);
      setAudioUrl(audioUrl);

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Audio = reader.result.split(',')[1];
        onSendAudio?.(base64Audio);
      };
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? '🛑 Stop Recording' : '🎤 Start Recording'}
      </button>

      <AudioPlayer audioUrl={audioUrl} />
      <Transcript transcript={transcriptLines} interim={interimTranscript} />
    </div>
  );
};

export default Recorder;
