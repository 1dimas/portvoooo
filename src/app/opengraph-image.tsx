import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Dimas — Full Stack Developer & Digital Business Architect";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    padding: "80px",
                    fontFamily: "Inter, sans-serif",
                    boxSizing: "border-box",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                }}
            >
                {/* Background Accent Lines */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

                {/* Top Header */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", zIndex: 10 }}>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <div style={{ width: "40px", height: "40px", backgroundColor: "#ff98a2" }} />
                        <span style={{ fontSize: "36px", fontWeight: "bold", letterSpacing: "4px", color: "#ff98a2", textTransform: "uppercase" }}>PORTFOLIO</span>
                    </div>
                    {/* Main Title */}
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "40px" }}>
                        <span style={{ fontWeight: 900, fontSize: "140px", lineHeight: 0.9, letterSpacing: "-4px", textTransform: "uppercase" }}>DIMAS</span>
                        <span style={{ fontWeight: 900, fontSize: "80px", lineHeight: 1, color: "#6b6b6b", textTransform: "uppercase" }}>FULL STACK</span>
                        <span style={{ fontWeight: 900, fontSize: "80px", lineHeight: 1, color: "#a0a0a0", textTransform: "uppercase" }}>DEVELOPER</span>
                    </div>
                </div>

                {/* Bottom Footer Info */}
                <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "flex-end", borderTop: "4px solid #333333", paddingTop: "40px", zIndex: 10 }}>
                    <span style={{ fontSize: "32px", color: "#a0a0a0", fontWeight: "bold" }}>github.com/1dimas</span>
                    <span style={{ fontSize: "32px", color: "#a0a0a0", fontWeight: "bold" }}>+62 899-8076-063</span>
                    <span style={{ fontSize: "32px", color: "#a0a0a0", fontWeight: "bold" }}>dimasdwianandaputra@gmail.com</span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
