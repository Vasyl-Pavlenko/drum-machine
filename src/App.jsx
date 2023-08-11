import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

const soundData = {
  drum: [
    {
      keyCode: 81,
      keyTrigger: 'Q',
      id: 'Heater-1',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
    }, {
      keyCode: 87,
      keyTrigger: 'W',
      id: 'Heater-2',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
    }, {
      keyCode: 69,
      keyTrigger: 'E',
      id: 'Heater-3',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
    }, {
      keyCode: 65,
      keyTrigger: 'A',
      id: 'Heater-4',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
    }, {
      keyCode: 83,
      keyTrigger: 'S',
      id: 'Clap',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
    }, {
      keyCode: 68,
      keyTrigger: 'D',
      id: 'Open-H',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
    }, {
      keyCode: 90,
      keyTrigger: 'Z',
      id: "Kick-n'-Hat",
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
    }, {
      keyCode: 88,
      keyTrigger: 'X',
      id: 'Kick',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
    }, {
      keyCode: 67,
      keyTrigger: 'C',
      id: 'Closed-H',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
    },
  ],
  piano: [
    {
      keyCode: 81,
      keyTrigger: 'Q',
      id: 'Chord-1',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3'
    }, {
      keyCode: 87,
      keyTrigger: 'W',
      id: 'Chord-2',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3'
    }, {
      keyCode: 69,
      keyTrigger: 'E',
      id: 'Chord-3',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3'
    }, {
      keyCode: 65,
      keyTrigger: 'A',
      id: 'Shaker',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3'
    }, {
      keyCode: 83,
      keyTrigger: 'S',
      id: 'Open-HH',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3'
    }, {
      keyCode: 68,
      keyTrigger: 'D',
      id: 'Closed-HH',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3'
    }, {
      keyCode: 90,
      keyTrigger: 'Z',
      id: 'Punchy-Kick',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3'
    }, {
      keyCode: 88,
      keyTrigger: 'X',
      id: 'Side-Stick',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3'
    }, {
      keyCode: 67,
      keyTrigger: 'C',
      id: 'Snare',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3'
    }
  ],
};

export const App = () => {
  const [displayText, setDisplayText] = useState(null);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [selectedBank, setSelectedBank] = useState('drum');
  const [volume, setVolume] = useState(0.5);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [audioElements, setAudioElements] = useState({});

  useEffect(() => {
    const loadedAudioElements = {};
    soundData[selectedBank].forEach(sound => {
      const audio = new Audio(sound.url);
      audio.addEventListener("loadeddata", () => {
        audio.currentTime = 0;
        audio.volume = volume;
      });
      loadedAudioElements[sound.keyTrigger] = audio;
    });
    setAudioElements(loadedAudioElements);
  }, [selectedBank, volume]);

  const handleBankChange = () => {
    setSelectedBank(prevBank => (prevBank === 'drum' ? 'piano' : 'drum'));
  };

  const handlePowerChange = () => {
    setIsPowerOn(prevPower => !prevPower);
    if (!!isPowerOn) {
      setDisplayText("");
    }
  };

  const playSound = useCallback((sound) => {
    if (isPowerOn) {
      const audio = audioElements[sound.keyTrigger];
      audio.currentTime = 0;
      audio.volume = volume;

      setDisplayText(sound.id);

      if (!audio.paused) {
        audio.pause();
      }

      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }, [isPowerOn, volume, audioElements]);

const handlePadClick = (event, sound) => {
  const audio = event.target.firstElementChild;
  audio.currentTime = 0;
  audio.volume = volume;

  setDisplayText(sound.id);

  if (!audio.paused) {
    audio.pause();
  }

  audio.play().then(() => {
    setTimeout(() => {
      setDisplayText('');
    }, 400);
  }).catch(error => {
    console.error('Error playing audio:', error);
  });
};

  const handleVolumeChange = (event) => {
    const parsedValue = parseFloat(event.target.value);
    setVolume(parsedValue);
    setDisplayText(`Volume: ${(parsedValue * 100).toFixed(0)}%`);
    setTimeout(() => setDisplayText(""), 400);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      console.log('Key Pressed:', event.key);
      if (isPowerOn) {
        const sounds = soundData[selectedBank];
        const sound = sounds.find((data) => data.keyCode === event.keyCode);
        if (sound) {
          playSound(sound);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPowerOn, selectedBank, playSound]);

  useEffect(() => {
    setDisplayText(selectedBank === 'drum' ? 'Drum Kit' : 'Piano Kit');
  }, [selectedBank]);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    if (isPageLoaded) {
      setSelectedBank('drum');
    } else {
      setDisplayText('');
    }
  }, [isPageLoaded]);

  return (
    <div id="drum-machine">
      <div id="display">
        {isPowerOn && displayText}
      </div>

      <div className="controls-container">
        <div className="control">
          <p>Power</p>

          <label className="switch">
            <input
              type="checkbox"
              checked={isPowerOn}
              onChange={handlePowerChange}
            />

            <span className="slider round"></span>
          </label>
        </div>

        <div className="volume-slider">
          <input
            max="1"
            min="0"
            step="0.01"
            type="range"
            value={volume}
            onChange={handleVolumeChange}
            disabled={!isPowerOn}
          />
        </div>

        <div className="control">
          <p>Bank</p>

          <label className="switch">
            <input
              type="checkbox"
              checked={selectedBank === 'piano'}
              onChange={handleBankChange}
              disabled={!isPowerOn}
            />

            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="drum-pads">
        {soundData[selectedBank].map((sound) => (
          <div
            key={sound.keyTrigger}
            className="drum-pad"
            id={sound.id}
            onClick={(event) => handlePadClick(event, sound)}
          >
            {sound.keyTrigger}
            <audio
              className="clip"
              src={sound.url}
              id={sound.keyTrigger}
            ></audio>
          </div>
        ))}
      </div>
    </div>
  );
};
