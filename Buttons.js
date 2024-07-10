import React from 'react';
import PropTypes from 'prop-types';
import './Buttons.css';

const Button = ({ onClick, disabled = false, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`custom-button ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const ChatButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} className="chat-button">
      Chat
    </Button>
  );
};

ChatButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const MuteButton = ({ onClick, isMuted }) => {
  return (
    <Button onClick={onClick} className="mute-button">
      {isMuted ? 'Unmute' : 'Mute'}
    </Button>
  );
};

MuteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isMuted: PropTypes.bool.isRequired,
};

const CameraOffButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} className="camera-off-button">
      Kamera aus
    </Button>
  );
};

CameraOffButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const EmojisButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} className="emojis-button">
      Emojis
    </Button>
  );
};

EmojisButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const MicButton = ({ onClick, isMicOn }) => {
  return (
    <Button onClick={onClick} className="mic-button">
      {isMicOn ? 'Mic Off' : 'Mic On'}
    </Button>
  );
};

MicButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isMicOn: PropTypes.bool.isRequired,
};

export { ChatButton, MuteButton, CameraOffButton, EmojisButton, MicButton };
