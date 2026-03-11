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
    const lastLandmarkTimeRef = useRef<number>(0);

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

            // Check if API is available (requires HTTPS or localhost)
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Kamera tidak dapat diakses. Pastikan browser mendukung dan menggunakan koneksi aman (HTTPS/localhost).");
            }

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
        } catch (err: unknown) {
            console.error("Failed to initialize MediaPipe", err);
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage || "Failed to initialize webcam or AI model");
            setIsInitializing(false);
        }
    };

    const detectLoop = () => {
        if (!isReady) {
            if (requestRef.current !== -1) cancelAnimationFrame(requestRef.current);
            return;
        }

        const video = videoRef.current;
        const landmarker = handLandmarkerRef.current;

        // Ensure video is valid and has dimensions
        if (!video || !landmarker || video.readyState < 2 || video.videoWidth === 0) {
            requestRef.current = requestAnimationFrame(detectLoop);
            return;
        }

        if (video.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = video.currentTime;

            // eslint-disable-next-line react-hooks/purity
            const startTimeMs = performance.now();
            const adjustedNow = Math.floor(Math.max(startTimeMs, lastLandmarkTimeRef.current + 1));
            lastLandmarkTimeRef.current = adjustedNow;

            try {
                const results = landmarker.detectForVideo(video, adjustedNow);

                if (results && results.landmarks && results.landmarks.length > 0) {
                    const handRender = results.landmarks[0];
                    setLandmarks(handRender);

                    const thumbTip = handRender[4];
                    const indexTip = handRender[8];

                    if (thumbTip && indexTip) {
                        // Map relative coordinates to absolute screen pixels
                        const flippedX = 1 - indexTip.x;
                        const screenX = flippedX * window.innerWidth;
                        const screenY = indexTip.y * window.innerHeight;
                        setCursorPos({ x: screenX, y: screenY });

                        const dx = indexTip.x - thumbTip.x;
                        const dy = indexTip.y - thumbTip.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        setIsPinching(distance < sensitivity);
                    }
                } else {
                    setLandmarks(null);
                    setIsPinching(false);
                }
            } catch (err: unknown) {
                const errorStr = String(err);
                if (errorStr.includes("delegate for CPU") || errorStr.includes("delegate for GPU")) {
                    console.log("MediaPipe info (hand caught):", errorStr);
                } else {
                    console.warn("Gesture detection loop failed:", err);
                }
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
