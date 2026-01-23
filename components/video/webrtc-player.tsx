'use client';

import { useEffect, useRef, useState } from 'react';

interface WebRTCPlayerProps {
  src: string; // WHEP endpoint URL
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
  onError?: (error: Error) => void;
  onReady?: () => void;
}

export function WebRTCPlayer({
  src,
  autoPlay = true,
  muted = true,
  className,
  onError,
  onReady,
}: WebRTCPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const prevSrcRef = useRef<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Skip reinitialization if the src URL hasn't actually changed
    if (prevSrcRef.current === src && pcRef.current) {
      return;
    }
    prevSrcRef.current = src;

    let aborted = false;

    async function connect() {
      try {
        // Clean up previous connection
        if (pcRef.current) {
          pcRef.current.close();
          pcRef.current = null;
        }

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        pcRef.current = pc;

        // Add receive-only transceivers
        pc.addTransceiver('video', { direction: 'recvonly' });
        pc.addTransceiver('audio', { direction: 'recvonly' });

        pc.ontrack = (event) => {
          if (video && event.streams[0]) {
            video.srcObject = event.streams[0];
            setIsReady(true);
            onReady?.();
            if (autoPlay) {
              video.play().catch(() => {
                // Autoplay blocked, ignore
              });
            }
          }
        };

        pc.oniceconnectionstatechange = () => {
          if (pc.iceConnectionState === 'failed') {
            onError?.(new Error('WebRTC connection failed'));
          }
        };

        // Create offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Wait for ICE gathering to complete
        await new Promise<void>((resolve) => {
          if (pc.iceGatheringState === 'complete') {
            resolve();
          } else {
            pc.onicegatheringstatechange = () => {
              if (pc.iceGatheringState === 'complete') {
                resolve();
              }
            };
          }
        });

        if (aborted) return;

        // Send offer to WHEP endpoint
        const response = await fetch(src, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/sdp',
          },
          body: pc.localDescription?.sdp,
        });

        if (!response.ok) {
          throw new Error(`WHEP request failed: ${response.status}`);
        }

        const answerSdp = await response.text();
        if (aborted) return;

        await pc.setRemoteDescription({
          type: 'answer',
          sdp: answerSdp,
        });
      } catch (error) {
        if (!aborted) {
          onError?.(error instanceof Error ? error : new Error('WebRTC connection error'));
        }
      }
    }

    connect();

    return () => {
      aborted = true;
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only reinitialize on src change, not callback changes
  }, [src, autoPlay]);

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
