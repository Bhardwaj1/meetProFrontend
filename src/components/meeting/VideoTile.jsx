import { useEffect, useRef } from "react";
import { useMeeting } from "../../context/MeetingContext";

export default function VideoTile({ name, isMe, isMuted }) {
  const videoRef = useRef(null);
  const { localStreamRef } = useMeeting();

  useEffect(() => {
    if (!isMe) return;

    const video = videoRef.current;
    const stream = localStreamRef.current;

    if (!video || !stream) return;

    video.srcObject = stream;
    video.muted = true;

    const play = async () => {
      try {
        await video.play();
        console.log("▶️ video playing");
      } catch (e) {
        console.warn("play blocked, waiting for click");
      }
    };

    video.onloadedmetadata = play;
    setTimeout(play, 300);
  }, [isMe, localStreamRef.current]);


  

  return (
    <div className="relative aspect-video rounded-2xl bg-black border border-white/10 overflow-hidden">
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
