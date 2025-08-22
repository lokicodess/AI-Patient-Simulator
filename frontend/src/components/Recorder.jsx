import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Recorder = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const startListening = () => {
    console.log("Start recording");
    SpeechRecognition.startListening({
      continuous: false,
      language: 'en-IN',
      interimResults: true
    });
  };

  const stopListening = () => {
    console.log("Stop recording");
    SpeechRecognition.stopListening();  // ✅ Correct method
  };


  if (listening) {
    console.log("Listening...");
  } else {
    console.log("Not listening.");
    }

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={startListening}>Start</button>
      <button onClick={stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
    </div>
  );
};

export default Recorder;
