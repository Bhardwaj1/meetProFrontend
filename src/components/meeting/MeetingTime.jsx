import { useEffect, useState } from "react";

function MeetingTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setTime(`${hh}:${mm}`);
    };

    updateTime(); // immediate render

    const now = new Date();
    const seconds = now.getSeconds();
    const delayToNextMinute = (60 - seconds) * 1000;

    // ⏱️ align to next minute
    const timeout = setTimeout(() => {
      updateTime();

      const interval = setInterval(updateTime, 60000);

      // cleanup interval
      return () => clearInterval(interval);
    }, delayToNextMinute);

    return () => clearTimeout(timeout);
  }, []);


  

  return (
    <div className="absolute left-6 bottom-6 text-sm text-gray-300 font-medium">
      {time}
    </div>
  );
}

export default MeetingTime;
