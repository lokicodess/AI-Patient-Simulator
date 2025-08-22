import React, { useEffect } from 'react';

const Player = ({ text, voiceGender = 'female' }) => {
  useEffect(() => {
    if (!text) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();

    utterance.voice = voices.find(v =>
      voiceGender === 'male' ? v.name.includes('Male') : v.name.includes('Female')
    ) || voices[0];

    synth.speak(utterance);
  }, [text, voiceGender]);

  return null;
};

export default Player;
