import { useState, useEffect, useRef, useCallback } from 'react';
import { useProgress } from '../contexts/useProgress';

export function useStudyTimer() {
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const { dispatch } = useProgress();
    const intervalRef = useRef(null);
    const lastLogRef = useRef(0);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isActive]);

    // Log every 5 minutes
    useEffect(() => {
        const minutesPassed = Math.floor(seconds / 60);
        if (minutesPassed > lastLogRef.current && minutesPassed % 5 === 0) {
            lastLogRef.current = minutesPassed;
            dispatch({ type: 'LOG_STUDY_TIME', payload: { minutes: 5, xp: 5 } });
        }
    }, [seconds, dispatch]);

    const start = useCallback(() => setIsActive(true), []);
    const pause = useCallback(() => setIsActive(false), []);
    const reset = useCallback(() => {
        setIsActive(false);
        setSeconds(0);
        lastLogRef.current = 0;
    }, []);

    const formatTime = useCallback(() => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }, [seconds]);

    return { isActive, seconds, start, pause, reset, formatTime };
}
