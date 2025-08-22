import logo from './logo.svg';
import './App.css';
import VoiceApp from './components/VoiceApp';
import TextToAudio from './components/TextToAudio';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js';

function App() {
  return (
    <div className="App content-wrapper">
      <VoiceApp />
      {/* <TextToAudio /> */}
    </div>
  );
}

export default App;
