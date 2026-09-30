export interface LabItem {
    title: string;
    description: string;
    tech: string[];
    status: "WIP" | "Done" | "Concept";
    /** Tidak ada untuk item WIP/Concept yang belum punya halaman */
    link?: string;
    useCase?: string[];
    impact?: string[];
}

export const labItems: LabItem[] = [
    {
        title: "The Cross-Window Portal",
        description: "Sihir sinkronisasi antar-jendela. Lempar objek dari Jendela A dan saksikan ia menyeberang ke Jendela B secara real-time menggunakan koordinat absolut layar.",
        tech: ["BroadcastChannel", "Framer Motion", "Math"],
        status: "Done",
        link: "/lab/cross-window",
        useCase: ["Multi-monitor dashboards", "Collaborative editing tools"],
        impact: ["Seamless cross-window UX without server"]
    },
    {
        title: "The Sentient UI",
        description: "Sistem cerdas yang merekam heatmap interaksi user (hover, scroll) dan bermutasi secara mandiri untuk menyesuaikan gaya elemen yang sering diperhatikan.",
        tech: ["LocalStorage", "Intersection/Mouse Observer", "Framer Motion"],
        status: "Done",
        link: "/lab/sentient-ui",
        useCase: ["Auto-personalized layouts", "Smart content prioritization"],
        impact: ["Higher engagement through adaptive UI"]
    },
    {
        title: "The Adaptive Survivor",
        description: "Hardware-Aware UI. Performa visual dan media merespons secara real-time terhadap level baterai dan kecepatan internet untuk menghemat daya. Eco-mode cerdas.",
        tech: ["Battery API", "Network API", "Framer Motion"],
        status: "Done",
        link: "/lab/adaptive-survivor",
        useCase: ["Improve UX on low-end devices", "Progressive media loading"],
        impact: ["Reduce lag & battery drain", "Better Core Web Vitals"]
    },
    {
        title: "Neural Gesture Interface",
        description: "Kontrol peramban tanpa menyentuh mouse. Render UI melayang dan melukis kanvas interaktif dengan melacak koordinat kerangka jari dari webcam.",
        tech: ["MediaPipe Vision AI", "Framer Motion", "Canvas 2D"],
        status: "Done",
        link: "/lab/neural-gesture",
        useCase: ["Touchless kiosk interfaces", "Accessibility input alternative"],
        impact: ["Zero-contact interaction", "Inclusive design exploration"]
    },
    {
        title: "Chaos Desktop",
        description: "Tiling Window Manager tribute. UI Cards berwujud fisik yang reaktif terhadap gravitasi, tabrakan, dan momentum (Hyprland style).",
        tech: ["Matter.js", "Framer Motion", "Physics"],
        status: "Done",
        link: "/lab/chaos-desktop",
        useCase: ["Physics-based UI layouts", "Creative portfolio presentations"],
        impact: ["Memorable interactive experience"]
    },
    {
        title: "Kinetic Typography",
        description: "Eksplorasi ilusi optik 'Semantic Shift' dan lensa cair menggunakan CSS Masking dan Velocity Tracking GPU.",
        tech: ["clip-path", "Framer Motion", "useVelocity"],
        status: "Done",
        link: "/lab/kinetic-typography",
        useCase: ["Dynamic hero sections", "Brand storytelling animations"],
        impact: ["GPU-accelerated text effects at 60fps"]
    },
    {
        title: "Magnetic Grid",
        description: "Sistem grid berkinerja tinggi yang bereaksi terhadap posisi kursor. Mensimulasikan gaya magnet multi-force dengan variasi visual interaktif.",
        tech: ["Framer Motion", "useMotionValue", "Math Physics"],
        status: "Done",
        link: "/lab/magnetic-grid",
        useCase: ["Interactive backgrounds", "Data visualization overlays"],
        impact: ["Cursor-aware responsive layouts"]
    },
    {
        title: "Cymatic Geometry",
        description: "Visualisasi partikel digital yang merespons frekuensi suara. Menggunakan Web Audio API dan Canvas berkinerja tinggi untuk membentuk pola Chladni, Lissajous, dan Spiral dari mikrofon.",
        tech: ["Web Audio API", "Canvas 2D", "FFT Analysis"],
        status: "Done",
        link: "/lab/cymatic-geometry",
        useCase: ["Audio-reactive visualizers", "Music production tools"],
        impact: ["Real-time FFT → visual pattern mapping"]
    },
    {
        title: "The Code Cosmos",
        description: "Bentuk evolusi dari arsitektur tata surya 3D. Folder direpresentasikan sebagai planet, dan file-file di dalamnya mengorbit layaknya satelit (bulan) secara real-time.",
        tech: ["Three.js", "React Three Fiber", "Hierarchical 3D Orbiting"],
        status: "Done",
        link: "/lab/data-galaxy",
        useCase: ["Codebase visualization", "3D file system explorer"],
        impact: ["Intuitive repo structure overview"]
    },
    // Coming Soon / WIP Items
    {
        title: "Biometric Pulse Sync",
        description: "Deteksi detak jantung (BPM) via webcam menggunakan rPPG. UI dan ritme musik akan berdenyut mengikuti detak jantung biologis Anda.",
        tech: ["Computer Vision", "Web Audio", "Signal Processing"],
        status: "WIP",
        useCase: ["Biometric-driven UI pacing"],
        impact: ["Personalized rhythm experience"]
    },
    {
        title: "Holographic Parallax",
        description: "Eksperimen sensor gyroscope mobile untuk menciptakan efek kedalaman 3D 'look-around' yang ekstrem pada elemen UI statis.",
        tech: ["DeviceOrientation", "Framer Motion", "3D Transforms"],
        status: "Concept",
        useCase: ["Mobile-first 3D depth illusion"],
        impact: ["Native-feel parallax without a library"]
    }
];
