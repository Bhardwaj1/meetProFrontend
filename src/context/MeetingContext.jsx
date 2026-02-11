import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { getSocket } from "../socket/socket";

export const MeetingContext = createContext(null);

export function MeetingProvider({ children }) {
  const [participants, setParticipants] = useState([]);

  const localStreamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  const peerConnectionsRef = useRef({});
  const remoteStreamsRef = useRef({});

  // single source of truth for media button states
  const [mediaState, setMediaState] = useState({
    camera: "off", // off | starting | on | error
    mic: "on", // on | muted
  });

  const syncParticipantStream = useCallback((userId, stream) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id?.toString() === userId?.toString() ? { ...p, stream } : p,
      ),
    );
  }, []);

  const startLocalStream = useCallback(async () => {
    if (localStreamRef.current) {
      return localStreamRef.current;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;
    setLocalStream(stream);
    setMediaState((s) => ({ ...s, camera: "on" }));

    return stream;
  }, []);

  const closePeerConnection = useCallback((userId) => {
    const pc = peerConnectionsRef.current[userId];
    if (!pc) return;

    pc.onicecandidate = null;
    pc.ontrack = null;
    pc.close();

    delete peerConnectionsRef.current[userId];
    delete remoteStreamsRef.current[userId];

    syncParticipantStream(userId, null);
  }, [syncParticipantStream]);

  const stopLocalStream = useCallback(() => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    setLocalStream(null);
  }, []);

  const toggleCamera = useCallback(async () => {
    if (mediaState.camera === "on") {
      stopLocalStream();
      setMediaState((s) => ({ ...s, camera: "off" }));
      return;
    }

    setMediaState((s) => ({ ...s, camera: "starting" }));

    try {
      await startLocalStream();
    } catch (err) {
      console.error("Camera error:", err);
      setMediaState((s) => ({ ...s, camera: "error" }));
    }
  }, [mediaState.camera, startLocalStream, stopLocalStream]);

  const toggleMic = useCallback(() => {
    if (!localStreamRef.current) {
      setMediaState((s) => ({
        ...s,
        mic: s.mic === "on" ? "muted" : "on",
      }));
      return;
    }

    const audioTrack = localStreamRef.current.getAudioTracks().at(0);
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;

    setMediaState((s) => ({
      ...s,
      mic: audioTrack.enabled ? "on" : "muted",
    }));
  }, []);

  const createPeerConnection = useCallback((userId) => {
    if (peerConnectionsRef.current[userId]) {
      return peerConnectionsRef.current[userId];
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (!event.candidate) return;

      const socket = getSocket();
      if (!socket) return;

      socket.emit("webrtc-ice-candidate", {
        targetUserId: userId,
        candidate: event.candidate,
      });
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (!stream) return;

      remoteStreamsRef.current[userId] = stream;
      syncParticipantStream(userId, stream);
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    peerConnectionsRef.current[userId] = pc;
    return pc;
  }, [syncParticipantStream]);

  const createOffer = useCallback(async ({ remoteUserId, socket }) => {
    const pc = createPeerConnection(remoteUserId);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("webrtc-offer", {
      targetUserId: remoteUserId,
      offer,
    });
  }, [createPeerConnection]);

  const handleWebRtcOffer = useCallback(async ({ from, offer }, socket) => {
    const pc = createPeerConnection(from);

    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("webrtc-answer", {
      targetUserId: from,
      answer,
    });
  }, [createPeerConnection]);

  const handleWebRtcAnswer = useCallback(async ({ from, answer }) => {
    const pc = peerConnectionsRef.current[from];
    if (!pc) return;

    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  }, []);

  const handleWebRtcIceCandidate = useCallback(async ({ from, candidate }) => {
    const pc = peerConnectionsRef.current[from];
    if (!pc || !candidate) return;

    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  }, []);

  const removePeerConnection = useCallback((userId) => {
    closePeerConnection(userId);
  }, [closePeerConnection]);

  const leaveSession = useCallback(() => {
    Object.keys(peerConnectionsRef.current).forEach((userId) => {
      closePeerConnection(userId);
    });

    setParticipants([]);
    stopLocalStream();
    setMediaState({ camera: "off", mic: "on" });
  }, [closePeerConnection, stopLocalStream]);

  return (
    <MeetingContext.Provider
      value={{
        participants,
        setParticipants,
        localStream,
        mediaState,
        startLocalStream,
        toggleCamera,
        toggleMic,
        leaveSession,
        createOffer,
        handleWebRtcOffer,
        handleWebRtcAnswer,
        handleWebRtcIceCandidate,
        removePeerConnection,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export const useMeeting = () => useContext(MeetingContext);
