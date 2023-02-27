import React from 'react';
import './App.css';

interface TemperatureProps {
  temp: number;
}

function LiveValue({ temp } : TemperatureProps) {
  let warning_string = "";

  let valueColour = 'white';
  switch (true) {
    case (temp < 20 || temp > 80):
      valueColour = 'red';
      break;
    case (temp < 30 || temp > 70):
      valueColour = 'yellow';
      break;
    default:
      valueColour = 'white';
  }

  return (
      <header className="live-value" style={{ color : valueColour }}>
        {`${temp.toString()}°C`}
      </header>
  );
}

export default LiveValue;