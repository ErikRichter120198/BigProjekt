// VideoChat.js (Frontend)

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Verbindung zum Socket.IO-Server herstellen

const VideoChat = () => {
  const localVideoRef = useRef();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [remoteStreams, setRemoteStreams] = useState([]);

  useEffect(() => {
    // Funktion zum Initialisieren der Medienstreams
    const initMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localVideoRef.current.srcObject = stream;
        socket.emit("stream", stream); // Senden des eigenen Streams an den Server

        socket.on("stream", (socketId, remoteStream) => {
          setRemoteStreams((prevStreams) => [
            ...prevStreams,
            { socketId, stream: remoteStream },
          ]);
        });

        socket.on("stopStream", (socketId) => {
          setRemoteStreams((prevStreams) =>
            prevStreams.filter((stream) => stream.socketId !== socketId)
          );
        });
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    initMediaStream();

    return () => {
      socket.emit("stopStream"); // Beenden des eigenen Streams beim Verlassen
    };
  }, []);

  const toggleCamera = () => {
    const updatedCameraStatus = !isCameraOn;
    setIsCameraOn(updatedCameraStatus);
    socket.emit("toggleCamera", updatedCameraStatus);
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted playsInline></video>
      {remoteStreams.map((remoteStream) => (
        <video key={remoteStream.socketId} autoPlay playsInline>
          <track kind="captions" srcLang="en" />
          Your browser does not support the video tag.
        </video>
      ))}
      <button onClick={toggleCamera}>
        {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
      </button>
    </div>
  );
};

export default VideoChat;
