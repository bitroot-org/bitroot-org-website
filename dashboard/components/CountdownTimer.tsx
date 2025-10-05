"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2025-10-07T09:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 text-white shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Project Deadline</h2>
        <p className="text-white/90 text-sm md:text-base">October 7, 2025 at 9:00 AM</p>
      </div>

      <div className="grid grid-cols-4 gap-4 md:gap-6">
        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6 w-full">
            <div className="text-3xl md:text-5xl lg:text-6xl font-bold tabular-nums">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="text-xs md:text-sm font-medium mt-2 uppercase tracking-wider">
            Days
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6 w-full">
            <div className="text-3xl md:text-5xl lg:text-6xl font-bold tabular-nums">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="text-xs md:text-sm font-medium mt-2 uppercase tracking-wider">
            Hours
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6 w-full">
            <div className="text-3xl md:text-5xl lg:text-6xl font-bold tabular-nums">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="text-xs md:text-sm font-medium mt-2 uppercase tracking-wider">
            Minutes
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6 w-full">
            <div className="text-3xl md:text-5xl lg:text-6xl font-bold tabular-nums">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="text-xs md:text-sm font-medium mt-2 uppercase tracking-wider">
            Seconds
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-white/80">Time remaining until submission deadline</p>
      </div>
    </div>
  );
}
