import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import './VideoChat.css';

const VideoChat = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [stream, setStream] = useState(null);
  const initializePeerConnection = () => {
    
    
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = event => {
      if (event.candidate) {
        socketRef.current.emit('candidate', event.candidate);
      }
    };

    pc.ontrack = event => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    return pc;
  };

  const startVideo = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = localStream;
      setStream(localStream);

      peerConnectionRef.current = initializePeerConnection();

      localStream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, localStream);
      });

      socketRef.current.emit('join');

    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };
  
  useEffect(() => {
    socketRef.current = io('http://localhost:5000',{
        withCredentials: true
         }); 

    startVideo();

    socketRef.current.on('offer', async (id, description) => {
      if (!peerConnectionRef.current) {
        peerConnectionRef.current = initializePeerConnection();
        stream.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, stream);
        });
      }

      await peerConnectionRef.current.setRemoteDescription(description);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socketRef.current.emit('answer', id, peerConnectionRef.current.localDescription);
    });

    socketRef.current.on('answer', async (description) => {
      await peerConnectionRef.current.setRemoteDescription(description);
    });

    socketRef.current.on('candidate', async (candidate) => {
      try {
        await peerConnectionRef.current.addIceCandidate(candidate);
      } catch (error) {
        console.error('Error adding received ice candidate', error);
      }
    });

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="video-container">
      <div className="video-wrapper">
        <video ref={localVideoRef} autoPlay muted></video>
      </div>
      <div className="video-wrapper">
        <video ref={remoteVideoRef} autoPlay></video>
      </div>
      {/* Füge hier weitere video-wrapper hinzu, wenn neue Teilnehmer beitreten */}
    </div>
  );
};

export default VideoChat;
