/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useCallback, useEffect, useState } from "react";

export default function SuccessMessage({
  text,
  triggerShow,
}: {
  text: string;
  triggerShow: number;
}) {
  const [queue, setQueue] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const showMessage = useCallback(() => {
    setIsVisible(true);
    setIsExiting(false);

    setTimeout(() => {
      setIsExiting(true);

      setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
        setIsWaiting(true);

        setTimeout(() => {
          setIsWaiting(false);
          setQueue((prevQueue) => prevQueue.slice(1));
        }, 1000);
      }, 500);
    }, 3000);
  }, []);

  useEffect(() => {
    if (triggerShow > 0) {
      setQueue((prevQueue) => [...prevQueue, triggerShow]);
    }
  }, [triggerShow]);

  useEffect(() => {
    if (queue.length > 0 && !isVisible && !isExiting && !isWaiting) {
      showMessage();
    }
  }, [queue, isVisible, isExiting, isWaiting, showMessage]);

  const handleClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      setIsWaiting(true);
      setTimeout(() => {
        setIsWaiting(false);
        setQueue((prevQueue) => prevQueue.slice(1));
      }, 1000);
    }, 500);
  };

  return (
    <div
      onClick={handleClick}
      className={`fixed z-50 rounded-full bg-gradient-to-b from-[#39ED97] to-[#1C754A] shadow-xl transition-all duration-500 ease-in-out active:scale-90 ${isVisible ? (isExiting ? "top-0 opacity-0" : "top-16 opacity-100") : "-top-full opacity-0"}} `}
    >
      <div className="pointer-events-none relative z-[52] m-0.5 rounded-full bg-gradient-to-b from-[#39ED97] to-[#1C754A] px-5 py-3 text-center font-semibold text-white">
        {text}
      </div>
      <div className="pointer-events-none absolute top-0 z-[51] h-full w-full rounded-full bg-gradient-to-b from-black/0 to-black/20" />
    </div>
  );
}
