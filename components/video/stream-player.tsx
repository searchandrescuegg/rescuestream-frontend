'use client';

import { useState, useCallback, useEffect } from 'react';
import { HLSPlayer } from './hls-player';
import { WebRTCPlayer } from './webrtc-player';
import type { StreamURLs } from '@/types';

interface StreamPlayerProps {
  urls: StreamURLs;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
  onReady?: () => void;
  onProtocolChange?: (protocol: 'webrtc' | 'hls') => void;
}

type Protocol = 'webrtc' | 'hls';

export function StreamPlayer({
  urls,
  autoPlay = true,
  muted = true,
  className = 'h-full w-full object-cover',
  onReady,
  onProtocolChange,
}: StreamPlayerProps) {
  const [protocol, setProtocol] = useState<Protocol>('webrtc');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onProtocolChange?.(protocol);
  }, [protocol, onProtocolChange]);

  const handleWebRTCError = useCallback(() => {
    // Fallback to HLS on WebRTC failure
    setProtocol('hls');
    setError(null);
  }, []);

  const handleHLSError = useCallback((err: Error) => {
    setError(err.message);
  }, []);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <p className="text-sm text-muted-foreground">Unable to play stream</p>
      </div>
    );
  }

  if (protocol === 'webrtc') {
    return (
      <WebRTCPlayer
        src={urls.webrtc}
        autoPlay={autoPlay}
        muted={muted}
        className={className}
        onError={handleWebRTCError}
        onReady={onReady}
      />
    );
  }

  return (
    <HLSPlayer
      src={urls.hls}
      autoPlay={autoPlay}
      muted={muted}
      className={className}
      onError={handleHLSError}
      onReady={onReady}
    />
  );
}
