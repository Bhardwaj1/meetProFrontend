import { useEffect, useRef } from "react";
import { VideoOff } from "lucide-react";

export default function VideoTile({ name, isMe, isMuted, animate, stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !stream) {
      return;
    }

    const video = videoRef.current;
    video.srcObject = stream;
    video.muted = isMe;

    const play = async () => {
      try {
        await video.play();
      } catch (e) {
        console.error("Video play error:", e);
      }
    };

    video.onloadedmetadata = play;

    return () => {
      video.srcObject = null;
    };
  }, [isMe, stream]);

  return (
    <div
      className={`
    relative w-full h-full rounded-2xl bg-black
    border border-white/10 overflow-hidden
    transition-all duration-500 ease-out
    ${animate ? "scale-100 opacity-100" : "opacity-90"}
    ${animate ? "animate-join" : ""}
  `}
    >
      {isMe ? (
        stream ? (
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <VideoOff size={48} className="mb-2 opacity-50" />
            <p className="text-sm opacity-70">Camera Off</p>
          </div>
        )
      ) : (
        stream ? (
          <video ref={videoRef} playsInline autoPlay className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-white">{name}</div>
        )
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
