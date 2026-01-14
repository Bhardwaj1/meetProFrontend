import { createContext, useContext, useRef, useState, useCallback } from "react";

const MeetingContext = createContext(null);

export function MeetingProvider({ children }) {
  const [participants, setParticipants] = useState([]);

  const localStreamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  // 🔑 MEDIA STATE = SINGLE SOURCE OF TRUTH
  const [mediaState, setMediaState] = useState({
    camera: "off", // off | starting | on | error
    mic: "on",     // on | muted
  });

  /* ============================
     START LOCAL STREAM
  ============================ */
  const startLocalStream = useCallback(async () => {
    if (localStreamRef.current) return localStreamRef.current;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;
    setLocalStream(stream);

    return stream;
  }, []);

  /* ============================
     STOP LOCAL STREAM
  ============================ */
  const stopLocalStream = useCallback(() => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
  }, []);

  /* ============================
     CAMERA TOGGLE (ENTERPRISE)
  ============================ */
  const toggleCamera = useCallback(async () => {
    if (mediaState.camera === "on") {
      stopLocalStream();
      setMediaState((s) => ({ ...s, camera: "off" }));
      return;
    }

    setMediaState((s) => ({ ...s, camera: "starting" }));

    try {
      await startLocalStream();
      setMediaState((s) => ({ ...s, camera: "on" }));
    } catch (err) {
      console.error("Camera error:", err);
      setMediaState((s) => ({ ...s, camera: "error" }));
    }
  }, [mediaState.camera, startLocalStream, stopLocalStream]);

  /* ============================
     MIC TOGGLE (REAL)
  ============================ */
  const toggleMic = useCallback(() => {
    if (!localStreamRef.current) {
      setMediaState((s) => ({
        ...s,
        mic: s.mic === "on" ? "muted" : "on",
      }));
      return;
    }

    const audioTrack = localStreamRef.current
      .getAudioTracks()
      .at(0);

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;

    setMediaState((s) => ({
      ...s,
      mic: audioTrack.enabled ? "on" : "muted",
    }));
  }, []);

  /* ============================
     LEAVE SESSION
  ============================ */
  const leaveSession = useCallback(() => {
    setParticipants([]);
    stopLocalStream();
    setMediaState({ camera: "off", mic: "on" });
  }, [stopLocalStream]);

  return (
    <MeetingContext.Provider
      value={{
        participants,
        setParticipants,

        // media
        localStream,
        mediaState,

        // actions
        toggleCamera,
        toggleMic,
        leaveSession,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export const useMeeting = () => useContext(MeetingContext);
