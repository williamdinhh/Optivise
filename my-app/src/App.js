//statsig imports: 
import { StatsigProvider, useClientAsyncInit } from '@statsig/react-bindings';
import { StatsigAutoCapturePlugin } from '@statsig/web-analytics';
import { StatsigSessionReplayPlugin } from '@statsig/session-replay';
import { useStatsigClient } from '@statsig/react-bindings';

import logo from './logo.svg';
import './App.css';

function AppContent() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );

  
}

function App() {
  const { client } = useClientAsyncInit(
    "client-qFzSZVimIzwC9zb8mM91G0qkiAL4lEOCoj6vTHsq2Sa",
    { userID: 'a-user' }, 
    { plugins: [ new StatsigAutoCapturePlugin(), new StatsigSessionReplayPlugin() ] },
  );

  return (
    <StatsigProvider client={client} loadingComponent={<div>Loading...</div>}>
      <div>Hello Worldc How are u</div>
    </StatsigProvider>
  );
}


export default App;
