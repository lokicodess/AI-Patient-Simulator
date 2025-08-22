import React from 'react';

const Transcript = ({ transcript }) => {
  if (!transcript) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      <h4>📝 Transcribed Text:</h4>
        {transcript.map((line, index) => (
          <p key={index}>{line}</p> // Render each line as a paragraph
        ))}
    </div>
  );
};

export default Transcript;
