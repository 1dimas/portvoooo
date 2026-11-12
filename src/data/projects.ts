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
        role: "Frontend Developer (Modul Berita)",
        timeline: "2023",
        description:
            "Website company profile modern dengan desain responsif. Berfokus pada pengembangan modul dan kanal berita/artikel untuk kebutuhan publikasi informasi serta pembaruan perusahaan.",
        problem:
            "Perusahaan membutuhkan kanal publikasi informasi dan pembaruan berita yang terstruktur, cepat, dan mudah diakses untuk menjaga transparansi dan kredibilitas di mata publik.",
        solution:
            "Mengembangkan modul berita interaktif dan responsif menggunakan Next.js dan Tailwind CSS, mempermudah penyajian artikel/rilis pers perusahaan dengan navigasi yang intuitif dan loading cepat.",
        impact:
            "Meningkatkan efisiensi penyampaian informasi dan publikasi artikel perusahaan dengan antarmuka berita yang terstruktur dan responsif.",
        tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
        gradient: "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700",
        liveUrl: "#",
        githubUrl: "#",
        image: "/image/profile_company_v3.webp",
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
        image: "/image/Sportzone_v3.webp",
    },
    {
        slug: "solit03",
        title: "Solit03",
        category: "Profil Perusahaan",
        role: "Frontend Developer",
        timeline: "2026",
        description:
            "Website profil perusahaan untuk Solit03 — bisnis jual beli laptop second dan jasa servis. Menyatukan layanan, katalog, dan jalur kontak dalam satu halaman yang ringan dan rapi di semua ukuran layar.",
        problem:
            "Calon pembeli laptop second menilai kredibilitas penjual sebelum datang atau menghubungi. Tanpa kehadiran online resmi, toko hanya bisa bersaing lewat marketplace — tempat harga jadi satu-satunya pembeda.",
        solution:
            "Membangun situs profil perusahaan dengan Next.js. Struktur kontennya difokuskan pada layanan dan bukti kredibilitas, dengan waktu muat cepat serta tampilan konsisten dari mobile sampai desktop.",
        impact:
            "Perusahaan punya kanal resmi yang bisa dirujuk langsung ke calon pelanggan, lepas dari ketergantungan pada marketplace pihak ketiga.",
        tech: ["Next.js", "React", "Tailwind CSS"],
        gradient: "bg-gradient-to-br from-orange-600 via-rose-600 to-pink-700",
        liveUrl: "https://solit03.com",
        githubUrl: "#",
        image: "/image/Solit03.webp",
    },
    {
        slug: "simari-menu",
        title: "SIMARI Menu",
        category: "Sistem Pemesanan QR & POS",
        role: "Full Stack Developer",
        timeline: "2024",
        description:
            "Aplikasi pemesanan menu digital berbasis scan QR code meja yang terhubung langsung ke dashboard admin/kasir, dilengkapi status pesanan real-time dan verifikasi pembayaran manual.",
        problem:
            "Proses pemesanan manual di restoran rentan terhadap antrean panjang, pesanan salah catat, serta lambatnya konfirmasi pembayaran non-tunai pada jam sibuk.",
        solution:
            "Membangun sistem pemesanan via scan QR meja menggunakan Next.js dan NestJS. Pesanan langsung terbaca oleh kasir/admin secara real-time dan pelanggan dapat memantau status pesanan. Mendukung metode pembayaran Cash dan QR Statis dengan mekanisme upload foto bukti transfer yang wajib di-ACC oleh kasir sebelum diproses.",
        impact:
            "Mempercepat alur pemesanan meja ke dapur, menghilangkan risiko salah catat pesanan, dan memastikan validitas pembayaran non-tunai melalui approval kasir.",
        tech: ["Next.js", "NestJS", "TypeScript", "Tailwind CSS"],
        gradient: "bg-gradient-to-br from-amber-600 via-orange-600 to-red-600",
        liveUrl: "https://simari-menu.vercel.app/",
        githubUrl: "#",
        image: "/image/simari.png",
    },
];

export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((p) => p.slug === slug);
}
