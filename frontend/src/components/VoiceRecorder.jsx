import React, { useState, useRef, useContext } from "react";
import { ReactMic } from "react-mic";
import { WebSocketContext } from "../context/WebSocketProvider";

const VoiceRecorder = () => {
  const [record, setRecord] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceType, setVoiceType] = useState("female");
  const { socket, sendMessage } = useContext(WebSocketContext);

  const startRecording = () => setRecord(true);
  const stopRecording = () => setRecord(false);

  const onData = (recordedBlob) => {
    // stream recorded audio in chunks to backend (TODO)
  };

  const onStop = (recordedBlob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1];
      sendMessage(JSON.stringify({
        type: "audio_blob",
        data: base64data,
        voice: voiceType,
      }));
    };
    reader.readAsDataURL(recordedBlob.blob);
  };

  const playText = () => {
    if (transcript) {
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.voice = window.speechSynthesis
        .getVoices()
        .find((v) => voiceType === "male" ? v.name.includes("Male") : v.name.includes("Female"));
      window.speechSynthesis.speak(utterance);
    }
  };

  if (socket) {
    socket.onmessage = (event) => {
      const { type, text } = JSON.parse(event.data);
      if (type === "transcription") setTranscript(text);
    };
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Voice Recorder</h2>
      <ReactMic
        record={record}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
        strokeColor="#000000"
        backgroundColor="#FF4081"
      />
      <br />
      <button onClick={startRecording}>Start</button>
      <button onClick={stopRecording}>Stop</button>
      <select onChange={(e) => setVoiceType(e.target.value)} value={voiceType}>
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
      <h3>Transcribed Text:</h3>
      <p>{transcript}</p>
      <button onClick={playText}>Play as Voice</button>
    </div>
  );
};

export default VoiceRecorder;
