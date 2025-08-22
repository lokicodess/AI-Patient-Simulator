import React from 'react';

const AudioPlayer = ({ audioUrl }) => {
  if (!audioUrl) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      <h4>▶️ Playback:</h4>
      <audio controls src={audioUrl}></audio>
    </div>
  );
};

export default AudioPlayer;
