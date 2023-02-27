import React, { useState, useRef, useEffect } from 'react';
import LiveValue from './live_value'
import RedbackLogo from './redback-logo2.png';
import './App.css';

function App() {

  const [temperature, setTemperature] = useState<number>(0);

  const ws: any = useRef(null);

  useEffect(() => {
    // using the native browser WebSocket object
    const socket: WebSocket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("opened");
    };

    socket.onclose = () => {
      console.log("closed");
    };

    socket.onmessage = (event) => {
      console.log("got message", event.data);
      let message_obj = JSON.parse(event.data);
      setTemperature(message_obj["battery_temperature"].toPrecision(3));
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  let warning_string = '';
  switch (true) {
    case (temperature < 20 || temperature > 80):
      warning_string = 'DANGER';
      break;
    case (temperature < 30 || temperature > 70):
      warning_string = 'WARNING';
      break;
    default:
      warning_string = '';
  }
  
  return (
  <div className="App">
    <div className="background">
      <img src={RedbackLogo} className="redback-logo" alt="Redback Racing Logo"/>
    </div>
    <div className="battery-temperature">
      <header className="App-header">
        <p className='value-title'>
          <span className="live">LIVE</span> BATTERY TEMPERATURE:
        </p>
        <LiveValue temp={temperature}/>
        <p className={warning_string}>
          {`${warning_string}`}
        </p>
      </header>
    </div>
  </div>
  );
}

export default App;
