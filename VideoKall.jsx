import React, { useState, useRef, useEffect } from 'react';
import VideoChat from './VideoChat';
import { ChatButton, MuteButton, CameraOffButton, EmojisButton, MicButton } from './Buttons';
import './VideoKall.css';

const VideoKall = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [emojis, setEmojis] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState('User1'); // Beispiel aktueller Benutzer
  const localStreamRef = useRef(null); // Speichert den lokalen Medienstream

  useEffect(() => {
    // Beispiel: Zugriff auf den lokalen Stream
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(stream => {
        localStreamRef.current = stream;
      })
      .catch(error => console.error('Fehler beim Zugriff auf den Medienstream:', error));
  }, []);

  const handleChatClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleMuteClick = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleMicClick = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
      setIsMuted(!isMicOn); // Update mute status based on mic status
      console.log(`Mic is now ${!isMicOn ? 'On' : 'Off'}`);
    }
  };

  const handleCameraOffClick = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled; // Toggle video track enabled state
      });
      setIsCameraOn(!isCameraOn); // Toggle camera on/off state
      console.log(`Camera is now ${!isCameraOn ? 'On' : 'Off'}`);
    }
  };

  const handleEmojisClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji) => {
    const newEmoji = {
      emoji,
      id: Math.random().toString(36).substring(2, 9),
    };
    setEmojis([...emojis, newEmoji]);
    setShowEmojiPicker(false);

    setTimeout(() => {
      setEmojis((prevEmojis) => prevEmojis.filter((e) => e.id !== newEmoji.id));
    }, 3000); // Emoji verschwindet nach 3 Sekunden
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { user: currentUser, text: newMessage, id: Date.now() }]);
      setNewMessage('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>KonferenzRaum</h1>
      </header>
      <div className="video-container">
        <VideoChat localStreamRef={localStreamRef} />
        {emojis.map((e) => (
          <span key={e.id} className="emoji">{e.emoji}</span>
        ))}
        <span className={`mic-icon ${isMuted ? 'mic-muted' : ''}`}>
          {isMuted ? '🎤🚫' : '🎤'}
        </span>
        <span className={`camera-icon ${!isCameraOn ? 'camera-off' : ''}`}>
          {!isCameraOn ? '📷🚫' : '📷'}
        </span>
      </div>
      <div className="button-container">
        <ChatButton onClick={handleChatClick} />
        <MuteButton onClick={handleMuteClick} isMuted={isMuted} />
        <CameraOffButton onClick={handleCameraOffClick} />
        <EmojisButton onClick={handleEmojisClick} />
        <MicButton onClick={handleMicClick} isMicOn={isMicOn} />
      </div>
      {isChatOpen && (
        <div className="chat-box">
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className="message">
                <span className="user">{message.user}:</span>
                <span className="text">{message.text}</span>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nachricht eingeben..."
            />
            <button onClick={handleSendMessage}>Senden</button>
          </div>
        </div>
      )}
      {showEmojiPicker && (
        <div className="emoji-picker">
          {['😀', '😂', '😍', '👍', '🎉'].map((emoji) => (
            <span key={emoji} onClick={() => handleEmojiSelect(emoji)}>
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoKall;
