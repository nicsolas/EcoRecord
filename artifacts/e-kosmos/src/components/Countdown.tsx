import { useEffect, useState } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { useGetGameConfig } from '@workspace/api-client-react';

export function Countdown() {
  const { data: config } = useGetGameConfig();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!config?.countdownDeadline) return;
    
    const targetDate = new Date(config.countdownDeadline);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      if (now >= targetDate) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: differenceInDays(targetDate, now),
        hours: differenceInHours(targetDate, now) % 24,
        minutes: differenceInMinutes(targetDate, now) % 60,
        seconds: differenceInSeconds(targetDate, now) % 60,
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [config?.countdownDeadline]);

  if (!isClient) return null;

  return (
    <div className="bg-primary/10 border-b border-primary/20 p-3 text-center">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
        <span className="font-display font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full text-sm">
          🏆 Premiazione 20 Maggio 2026
        </span>
        <div className="flex items-center gap-2 font-mono text-foreground/80 font-bold">
          <div className="flex flex-col items-center">
            <span className="text-xl leading-none">{timeLeft.days.toString().padStart(2, '0')}</span>
            <span className="text-[10px] uppercase">giorni</span>
          </div>
          <span className="text-xl mb-3">:</span>
          <div className="flex flex-col items-center">
            <span className="text-xl leading-none">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-[10px] uppercase">ore</span>
          </div>
          <span className="text-xl mb-3">:</span>
          <div className="flex flex-col items-center">
            <span className="text-xl leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-[10px] uppercase">min</span>
          </div>
          <span className="text-xl mb-3">:</span>
          <div className="flex flex-col items-center text-primary">
            <span className="text-xl leading-none">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="text-[10px] uppercase">sec</span>
          </div>
        </div>
      </div>
    </div>
  );
}
