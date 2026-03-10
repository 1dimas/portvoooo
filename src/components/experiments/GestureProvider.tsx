"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { FilesetResolver, HandLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";

interface CursorPos {
    x: number;
    y: number;
}

interface GestureContextType {
    isReady: boolean;
    isInitializing: boolean;
    error: string | null;
    isPinching: boolean;
    cursorPos: CursorPos;
    landmarks: NormalizedLandmark[] | null;
    sensitivity: number; // Pinch distance threshold
    setSensitivity: (val: number) => void;
    enableWebcam: () => void;
}

const GestureContext = createContext<GestureContextType | null>(null);

export function GestureProvider({ children }: { children: ReactNode }) {
    const [isReady, setIsReady] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPinching, setIsPinching] = useState(false);
    const [cursorPos, setCursorPos] = useState<CursorPos>({ x: -100, y: -100 });
    const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null);
    const [sensitivity, setSensitivity] = useState(0.05); // Default pinch threshold is 5% of screen

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const handLandmarkerRef = useRef<HandLandmarker | null>(null);
    const requestRef = useRef<number>(-1);
    const canvasRef = useRef<HTMLCanvasElement | null>(null); // Offscreen canvas for optional image processing if needed
    const lastVideoTimeRef = useRef(-1);

    const initializeMediaPipe = async () => {
        try {
            setIsInitializing(true);
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );

            const handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numHands: 1, // Track 1 hand for simpler UI interaction
                minHandDetectionConfidence: 0.5,
                minHandPresenceConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            handLandmarkerRef.current = handLandmarker;

            // Start webcam
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: "user" }
            });

            const video = document.createElement("video");
            video.srcObject = stream;
            video.playsInline = true;
            video.autoplay = true;
            // Mirror the video so interaction feels natural
            video.style.transform = "scaleX(-1)";

            await new Promise((resolve) => {
                video.onloadeddata = () => {
                    video.play();
                    resolve(true);
                };
            });

            videoRef.current = video;
            setIsReady(true);
            setIsInitializing(false);

            // Start detection loop
            detectLoop();
        } catch (err: any) {
            console.error("Failed to initialize MediaPipe", err);
            setError(err.message || "Failed to initialize webcam or AI model");
            setIsInitializing(false);
        }
    };

    const detectLoop = () => {
        const video = videoRef.current;
        const landmarker = handLandmarkerRef.current;

        if (!video || !landmarker) return;

        // Ensure video is playing and has new frames
        if (video.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = video.currentTime;
            const startTimeMs = performance.now();

            const results = landmarker.detectForVideo(video, startTimeMs);

            if (results.landmarks && results.landmarks.length > 0) {
                const handRender = results.landmarks[0];
                setLandmarks(handRender);

                // Landmark 8: Index Finger Tip
                // Landmark 4: Thumb Tip
                const indexTip = handRender[8];
                const thumbTip = handRender[4];

                if (indexTip && thumbTip) {
                    // Map 0-1 relative coordinates to absolute window pixels
                    // Note: MediaPipe returns coordinates where x=0 is left of camera. 
                    // Since we mirrored the video mentally, we often need to flip X for UI interactions.
                    const flippedX = 1 - indexTip.x;

                    const screenX = flippedX * window.innerWidth;
                    const screenY = indexTip.y * window.innerHeight;

                    setCursorPos({ x: screenX, y: screenY });

                    // Calculate 2D distance for pinch detection
                    const dx = indexTip.x - thumbTip.x;
                    const dy = indexTip.y - thumbTip.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    setIsPinching(distance < sensitivity);
                }
            } else {
                setLandmarks(null);
                setIsPinching(false);
            }
        }

        requestRef.current = requestAnimationFrame(detectLoop);
    };

    useEffect(() => {
        return () => {
            if (requestRef.current !== -1) cancelAnimationFrame(requestRef.current);
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(t => t.stop());
            }
            if (handLandmarkerRef.current) {
                handLandmarkerRef.current.close();
            }
        };
    }, []);

    const enableWebcam = () => {
        if (!isReady && !isInitializing) {
            initializeMediaPipe();
        }
    };

    return (
        <GestureContext.Provider value={{
            isReady,
            isInitializing,
            error,
            isPinching,
            cursorPos,
            landmarks,
            sensitivity,
            setSensitivity,
            enableWebcam
        }}>
            {children}
        </GestureContext.Provider>
    );
}

export const useGesture = () => {
    const context = useContext(GestureContext);
    if (!context) throw new Error("useGesture must be used within GestureProvider");
    return context;
};
