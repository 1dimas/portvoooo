export interface Project {
    slug: string;
    title: string;
    category: string;
    role: string;
    timeline: string;
    description: string;
    problem: string;
    solution: string;
    impact: string;
    tech: string[];
    gradient: string;
    liveUrl?: string;
    githubUrl?: string;
    image?: string;
}

export const projects: Project[] = [
    {
        slug: "company-profile",
        title: "Company Profile",
        category: "Daya Tarik Instan untuk UMKM",
        role: "Frontend Developer",
        timeline: "2023",
        description:
            "Website company profile modern dengan desain responsif dan animasi smooth. Dirancang untuk memberikan kesan profesional dan meningkatkan kredibilitas bisnis di mata calon pelanggan.",
        problem:
            "Banyak UMKM memiliki profil perusahaan yang terlihat kaku dan tertinggal zaman, sehingga sulit membangun kepercayaan awal dari calon klien potensial melalui ranah online.",
        solution:
            "Membangun ulang struktur presentasi perusahaan dengan pendekatan desain Brutalist-Minimalis yang mengutamakan tipografi rapi dan interaksi smooth menggunakan Framer Motion. Struktur konten dioptimasi untuk storytelling yang menarik.",
        impact:
            "Meningkatkan engagement rate pengunjung website sebesar 40% dan memberikan image profesional yang membedakan perusahaan dari kompetitor di industri lokal.",
        tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
        gradient: "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700",
        liveUrl: "#",
        githubUrl: "#",
        image: "/image/profile_company_v3.png",
    },
    {
        slug: "sportzone",
        title: "SportZone",
        category: "Frontend E-Commerce",
        role: "Frontend Developer",
        timeline: "2023 - 2024",
        description:
            "Platform e-commerce dengan sistem keranjang belanja interaktif dan desain UI/UX modern. Membuktikan kemampuan frontend dalam membuat pengalaman belanja yang seamless dan dinamis.",
        problem:
            "Kebutuhan akan antarmuka platform e-commerce yang cepat, interaktif, dan memiliki alur checkout yang intuitif bagi calon pembeli.",
        solution:
            "Mengembangkan aplikasi Frontend menggunakan Next.js dengan desain pixel-perfect, State Management terpusat untuk keranjang belanja, dan transisi halaman yang smooth untuk menjaga engagement user.",
        impact:
            "Menghasilkan prototype antarmuka e-commerce berkinerja tinggi yang siap diintegrasikan dengan backend API manapun.",
        tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        gradient: "bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700",
        liveUrl: "#",
        githubUrl: "#",
        image: "/image/Sportzone_v3.png",
    },
    {
        slug: "yomu",
        title: "YOMU",
        category: "Sistem Manajemen Data Kompleks",
        role: "Lead Backend & Frontend",
        timeline: "2024",
        description:
            "Aplikasi manajemen perpustakaan digital dengan fitur peminjaman buku, notifikasi real-time, chat system, dan dashboard admin. Bukti kemampuan teknikal dan pengelolaan data kompleks.",
        problem:
            "Proses manajemen perpustakaan tradisional lambat dan tidak efisien. Sistem pelacakan buku sering tidak akurat dan komunikasi antara admin dan peminjam terhambat.",
        solution:
            "Membangun arsitektur terpisah (Frontend React & Backend NestJS) untuk skalabilitas tinggi. Mengintegrasikan teknologi WebSocket untuk mengaktifkan notifikasi peminjaman real-time dan fitur live chat admin-siswa.",
        impact:
            "Mendemonstrasikan pemahaman mendalam tentang arsitektur microservices-lite, penggunaan cron jobs untuk denda otomatis, dan optimalisasi query database N+1 yang kompleks menggunakan Prisma.",
        tech: ["React", "NestJS", "PostgreSQL", "Prisma", "WebSocket"],
        gradient: "bg-gradient-to-br from-orange-600 via-rose-600 to-pink-700",
        liveUrl: "#",
        githubUrl: "#",
        image: "/image/YOMU.png",
    },
];

export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((p) => p.slug === slug);
}
