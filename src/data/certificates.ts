export interface Certificate {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
    category: string;
    image: string;
    backImage?: string;
    credentialUrl?: string;
    /** Bento grid span: "large" = 2col×2row, "medium" = 2col×1row, "small" = 1col×1row */
    span: "large" | "medium" | "small";
}

export const certificates: Certificate[] = [
    {
        id: "cert-1",
        title: "Microsoft Certified: Azure Data Fundamentals",
        issuer: "Microsoft",
        date: "2024",
        description:
            "Sertifikasi dasar yang memvalidasi pemahaman tentang konsep data inti, data relasional dan non-relasional di cloud, serta analitik beban kerja menggunakan Microsoft Azure.",
        category: "Cloud & Data",
        image: "/image/SERTIFIKAT/azure data fundamental.jpg",
        span: "large",
        credentialUrl: "https://learn.microsoft.com/credentials/browse/",
    },
    {
        id: "cert-2",
        title: "Microsoft Office Specialist",
        issuer: "Microsoft / Certiport",
        date: "2024",
        description:
            "Sertifikasi kompetensi global yang memvalidasi keahlian teknis tingkat lanjut dalam menggunakan aplikasi produktivitas kantor Microsoft Office.",
        category: "Productivity",
        image: "/image/SERTIFIKAT/Microsoft Office Specialist.jpg",
        span: "medium",
    },
    {
        id: "cert-3",
        title: "Sertifikat Praktik Kerja Lapangan (PKL)",
        issuer: "Instansi / Perusahaan Mitra",
        date: "2024",
        description:
            "Sertifikat penyelesaian program Praktik Kerja Lapangan (PKL) industri sebagai bukti kompetensi dan pengalaman kerja praktis langsung di lapangan.",
        category: "Experience",
        image: "/image/SERTIFIKAT/PKL.jpg",
        span: "large",
    },
    {
        id: "cert-4",
        title: "Sistem Informasi Sarana & Prasarana",
        issuer: "Tim Pengembang Sekolah",
        date: "2024",
        description:
            "Penghargaan atas kontribusi penting dalam perancangan, pengembangan, dan implementasi aplikasi SISFOSARPRAS untuk digitalisasi manajemen aset sekolah.",
        category: "Web Development",
        image: "/image/SERTIFIKAT/SISFOSARPRAS.jpg",
        span: "medium",
    },
    {
        id: "cert-5",
        title: "Sertifikat Kepengurusan OSIS",
        issuer: "Organisasi Intra Sekolah (OSIS)",
        date: "2025",
        description:
            "Sertifikat kepengurusan aktif OSIS periode 2024/2025 atas kontribusi kepemimpinan, kepanitiaan, dan dedikasi penuh dalam berbagai kegiatan sekolah.",
        category: "Leadership",
        image: "/image/SERTIFIKAT/Sertifikat Organisasi Intra Sekolah_2025",
        span: "small",
    },
    {
        id: "cert-6",
        title: "DISC Personality Assessment",
        issuer: "Assessment Center",
        date: "2024",
        description:
            "Hasil resmi pengukuran profil psikologi menggunakan model DISC untuk menilai gaya perilaku (Dominance, Influence, Steadiness, Conscientiousness).",
        category: "Soft Skills",
        image: "/image/SERTIFIKAT/DISC.jpg",
        span: "small",
    },
    {
        id: "cert-7",
        title: "Certificate of Competency",
        issuer: "Lembaga Sertifikasi Profesi (LSP)",
        date: "2024",
        description:
            "Sertifikat kompetensi keahlian resmi yang menyatakan tingkat kompetensi teknis yang diakui secara nasional berdasarkan standar kerja yang berlaku.",
        category: "Competency",
        image: "/image/SERTIFIKAT/certificate of copetency.jpg",
        backImage: "/image/SERTIFIKAT/tampak belakang certificate of company.jpg",
        span: "medium",
    },
];
