export function useSound(src, volume = 0.6) {
  const audio = new Audio(src);
  audio.volume = volume;
  const play = () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };
  return play;
}
