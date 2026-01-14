import { useEffect, useRef } from "react";
import { useMeeting } from "../../context/MeetingContext";

export default function VideoTile({ name, isMe, isMuted, animate }) {
  const videoRef = useRef(null);
  const { localStream } = useMeeting();

  useEffect(() => {
    if (!isMe) return;
    if (!videoRef.current || !localStream) return;

    const video = videoRef.current;

    video.srcObject = localStream;
    video.muted = true;

    const play = async () => {
      try {
        await video.play();
        console.log("▶️ video playing");
      } catch (e) {
        console.warn("Autoplay blocked", e);
      }
    };

    video.onloadedmetadata = play;

    return () => {
      video.srcObject = null;
    };
  }, [isMe, localStream]);

  return (
    <div
      className={`
    relative aspect-video rounded-2xl bg-black
    border border-white/10 overflow-hidden
    transition-all duration-500 ease-out
    ${animate ? "scale-100 opacity-100" : "opacity-90"}
    ${animate ? "animate-join" : ""}
  `}
    >
      {isMe ? (
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          className="w-full h-full object-cover scale-x-[-1]"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-white">
          {name}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-black/40">
        <p className="text-sm font-semibold">
          {name} {isMe && "(You)"}
        </p>
        <p className="text-xs text-gray-300">{isMuted ? "Muted" : "Live"}</p>
      </div>
    </div>
  );
}
