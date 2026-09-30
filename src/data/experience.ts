export interface Experience {
    id: string;
    role: string;
    company: string;
    location?: string;
    /** Contoh: "2023 — Sekarang" */
    period: string;
    type: "Full-time" | "Freelance" | "Internship" | "Organization" | "Project";
    /** Sistem internal perusahaan — tampilkan badge NDA, sembunyikan demo/repo */
    confidential?: boolean;
    description: string;
    /** Poin pencapaian — usahakan ada angka/hasil konkret */
    highlights: string[];
    /** Modul/fitur dalam sistem — dirender sebagai chip grid, bukan bullet */
    modules?: string[];
    /** Angka kunci — dirender sebagai stat row dengan animasi hitung naik */
    stats?: { value: number; suffix?: string; label: string }[];
    tech: string[];
}

/** Diurutkan kronologis: paling lama di atas, paling baru di bawah. */
export const experiences: Experience[] = [
    {
        id: "exp-freelance",
        role: "Freelance Full Stack Developer",
        company: "Self-employed",
        period: "2023 — Sekarang",
        type: "Freelance",
        description:
            "Membangun produk digital end-to-end untuk UMKM dan klien personal, mulai dari company profile hingga platform e-commerce dan sistem informasi.",
        highlights: [
            "Meningkatkan engagement rate website klien hingga 40% lewat redesign Brutalist-Minimalis",
            "Mengerjakan 3 produk: Company Profile, SportZone (e-commerce), dan YOMU (sistem perpustakaan)",
            "Menangani seluruh siklus: requirement, desain UI, implementasi, sampai deployment",
        ],
        tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    },
    {
        id: "exp-pkl",
        role: "Full Stack Developer — Praktik Kerja Lapangan",
        company: "Bangun Kreatif Abadi",
        period: "2024",
        type: "Internship",
        description:
            "Membangun platform e-commerce lengkap dari nol sebagai proyek PKL industri — dari katalog produk sampai pembayaran terotomasi, dikerjakan hingga seluruh alur berfungsi penuh di lingkungan pengembangan.",
        highlights: [
            "Membangun platform e-commerce end-to-end: katalog produk, keranjang, checkout, hingga alur pemesanan",
            "Mengintegrasikan payment gateway Midtrans sehingga transaksi dapat diverifikasi dan diproses otomatis tanpa konfirmasi manual",
            "Memisahkan arsitektur frontend dan backend (Next.js + NestJS) agar sistem lebih mudah dikembangkan dan dipelihara",
        ],
        tech: ["Next.js", "NestJS", "Midtrans", "TypeScript"],
    },
    {
        id: "exp-osis",
        role: "Pengurus OSIS — Sekbid 4",
        company: "Organisasi Intra Sekolah (OSIS)",
        period: "2024 — 2025",
        type: "Organization",
        description:
            "Bertanggung jawab pada Bidang 4 — pembinaan prestasi akademik dan non-akademik, merancang program yang menyalurkan bakat dan minat siswa.",
        highlights: [
            "Menjalankan program pembinaan prestasi akademik maupun non-akademik sesuai bakat dan minat siswa",
            "Merancang dan mengoordinasi kegiatan bersama kepanitiaan lintas bidang",
        ],
        tech: [],
    },
    {
        id: "exp-solit03",
        role: "Senior Developer",
        company: "Solit03 — Jual Beli Laptop Second & Jasa Servis",
        period: "Juli 2026 — September 2026",
        type: "Full-time",
        confidential: true,
        description:
            "Developer di divisi IT yang baru dibentuk. Fokus pada integrasi AI, migrasi database, dan infrastruktur server yang menjalankan ERP perusahaan di produksi.",
        stats: [
            { value: 14, label: "Modul" },
            { value: 80, label: "Karyawan" },
            { value: 35, label: "Level Role" },
        ],
        highlights: [
            "Mengembangkan dan memelihara ERP internal bersama tim — sistem produksi yang dipakai seluruh divisi perusahaan",
            "Mengintegrasikan asisten AI DeepSeek yang terhubung ke data operasional: menjawab pertanyaan lintas modul, menyusun laporan, dan memberi rekomendasi",
            "Memimpin migrasi database dari Supabase ke PostgreSQL self-hosted",
            "Menyiapkan dan mengelola mini server Linux sebagai host sistem — menangani deployment serta optimasi query di produksi",
            "Membangun website profil perusahaan (solit03.com) sebagai kanal resmi publik",
        ],
        modules: [
            "Akuntansi & Cashflow",
            "Inventori / Data Barang",
            "Services",
            "Absensi Biometrik",
            "Kasir Mobile (POS)",
            "Misi Karyawan",
            "Quality Control",
            "Sales Online & Offline",
            "Marketing",
            "Content Management",
            "User Management",
            "Manajemen Kendaraan",
            "Pengantaran / Delivery",
            "Integrasi AI (DeepSeek)",
        ],
        tech: [
            "Next.js",
            "React",
            "PWA",
            "PostgreSQL",
            "Supabase",
            "SQL",
            "Linux",
            "DeepSeek API",
            "Hostinger",
        ],
    },
];
