import { useEffect, useRef } from "react";
import { useMeeting } from "../../context/MeetingContext";
import { VideoOff } from "lucide-react";

export default function VideoTile({ name, isMe, isMuted, animate }) {
  const videoRef = useRef(null);
  const { localStream, mediaState } = useMeeting();

  console.log("🎥 VideoTile Debug:", {
    name,
    isMe,
    hasLocalStream: !!localStream,
    cameraState: mediaState?.camera,
    videoTracks: localStream?.getVideoTracks().length,
    videoEnabled: localStream?.getVideoTracks()[0]?.enabled,
  });

  useEffect(() => {
    if (!isMe) return;
    if (!videoRef.current || !localStream) {
      console.log("⚠️ Video not ready:", { hasVideo: !!videoRef.current, hasStream: !!localStream });
      return;
    }

    const video = videoRef.current;
    const videoTrack = localStream.getVideoTracks()[0];

    console.log("✅ Setting up video:", {
      videoElement: !!video,
      streamId: localStream.id,
      videoTrackEnabled: videoTrack?.enabled,
      videoTrackReadyState: videoTrack?.readyState,
    });

    video.srcObject = localStream;
    video.muted = true;

    const play = async () => {
      try {
        await video.play();
        console.log("▶️ Video playing successfully");
      } catch (e) {
        console.error("❌ Video play error:", e);
      }
    };

    video.onloadedmetadata = play;

    return () => {
      console.log("🧹 Cleaning up video");
      video.srcObject = null;
    };
  }, [isMe, localStream]);

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
        localStream ? (
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
