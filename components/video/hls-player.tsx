'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
  onError?: (error: Error) => void;
  onReady?: () => void;
}

export function HLSPlayer({
  src,
  autoPlay = true,
  muted = true,
  className,
  onError,
  onReady,
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Clean up previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Check if browser natively supports HLS (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        setIsReady(true);
        onReady?.();
        if (autoPlay) {
          video.play().catch(() => {
            // Autoplay blocked, ignore
          });
        }
      });
      video.addEventListener('error', () => {
        onError?.(new Error('HLS playback error'));
      });
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsReady(true);
        onReady?.();
        if (autoPlay) {
          video.play().catch(() => {
            // Autoplay blocked, ignore
          });
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try to recover
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              onError?.(new Error(`HLS fatal error: ${data.type}`));
              hls.destroy();
              break;
          }
        }
      });
    } else {
      onError?.(new Error('HLS is not supported in this browser'));
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoPlay, onError, onReady]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted={muted}
      playsInline
      controls={false}
      data-ready={isReady}
    />
  );
}
