import Image from "next/image";
import Link from "next/link";
import MotionReveal from "../ui/MotionReveal";
import ScrambleText from "../ui/ScrambleText";

export default function Experience() {
  return (
    <section className="experience-root relative w-full min-h-screen bg-black overflow-hidden border-t border-white/5">
      <style>{`
        /* ── Diagonal clip split ── */
        .exp-image-panel {
          clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
        }
        @media (max-width: 767px) {
          .exp-image-panel {
            clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
          }
        }

        /* ── Scanline grain on image ── */
        .exp-image-panel::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.18) 2px,
              rgba(0,0,0,0.18) 4px
            );
          pointer-events: none;
          z-index: 2;
        }

        /* ── Tinted gradient over image ── */
        .exp-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            rgba(0,0,0,0.72) 0%,
            rgba(0,0,0,0.1) 60%,
            rgba(0,0,0,0.55) 100%
          );
          z-index: 1;
        }

        /* ── Floating oversized vol number ── */
        .exp-vol-number {
          position: absolute;
          right: -0.05em;
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-sarpanch, 'Sarpanch', sans-serif);
          font-size: clamp(160px, 22vw, 300px);
          font-weight: 900;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.07);
          pointer-events: none;
          user-select: none;
          z-index: 0;
          white-space: nowrap;
        }

        /* ── City tag ── */
        .exp-city-tag {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 2rem;
        }
        .exp-city-tag::before {
          content: "";
          display: block;
          width: 36px;
          height: 1px;
          background: var(--color-primary, #e63946);
          flex-shrink: 0;
        }

        /* ── Pill label ── */
        .exp-pill {
          display: inline-block;
          border: 1px solid rgba(255,255,255,0.12);
          padding: 4px 14px;
          letter-spacing: 0.35em;
          font-size: 9px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 1.5rem;
        }

        /* ── Heading stack ── */
        .exp-heading {
          font-family: var(--font-sarpanch, 'Sarpanch', sans-serif);
          font-size: clamp(52px, 7vw, 96px);
          font-weight: 900;
          line-height: 0.92;
          letter-spacing: -0.02em;
          color: #fff;
          margin-bottom: 3.5rem;
        }
        .exp-heading .accent-line {
          display: block;
          -webkit-text-stroke: 1px rgba(255,255,255,0.5);
          color: transparent;
        }

        /* ── Feature rows ── */
        .exp-feature-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          margin-bottom: 3.5rem;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .exp-feature-row {
          display: grid;
          grid-template-columns: 56px 1fr;
          gap: 0 20px;
          align-items: start;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transition: background 0.25s;
        }
        .exp-feature-row:hover {
          background: rgba(255,255,255,0.025);
        }
        .exp-feature-num {
          font-family: var(--font-sarpanch, 'Sarpanch', sans-serif);
          font-size: 11px;
          font-weight: 700;
          color: var(--color-primary, #e63946);
          letter-spacing: 0.1em;
          padding-top: 2px;
        }
        .exp-feature-text {
          font-size: 15px;
          font-weight: 300;
          color: rgba(255,255,255,0.65);
          line-height: 1.55;
          letter-spacing: 0.01em;
        }
        .exp-feature-text strong {
          display: block;
          font-size: 17px;
          font-weight: 600;
          color: rgba(255,255,255,0.92);
          margin-bottom: 2px;
          letter-spacing: 0;
        }

        /* ── CTA row ── */
        .exp-cta-row {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .exp-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
          max-width: 80px;
        }
        .exp-seats-hint {
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
          white-space: nowrap;
        }

        /* ── Floating corner badge ── */
        .exp-corner-badge {
          position: absolute;
          bottom: 28px;
          left: 28px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .exp-corner-badge-label {
          font-size: 8px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        .exp-corner-badge-value {
          font-family: var(--font-sarpanch, 'Sarpanch', sans-serif);
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.08em;
        }

        /* ── Ticker bar ── */
        .exp-ticker {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 20;
          height: 32px;
          background: var(--color-primary, #e63946);
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .exp-ticker-inner {
          display: flex;
          gap: 0;
          white-space: nowrap;
          animation: exp-tick 18s linear infinite;
        }
        @keyframes exp-tick {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .exp-ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 20px;
          padding: 0 32px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.75);
        }
        .exp-ticker-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(0,0,0,0.4);
          flex-shrink: 0;
        }

        /* ── Content wrapper padding ── */
        .exp-content {
          padding: 72px 56px 72px 56px;
        }
        @media (min-width: 768px) {
          .exp-content {
            padding: 80px 64px 80px 56px;
          }
        }
        @media (max-width: 767px) {
          .exp-content {
            padding: 40px 24px 80px 24px;
          }
        }
      `}</style>

      {/* ── LAYOUT: image left, content right (desktop) ── */}
      <div className="relative z-10 w-full min-h-screen flex flex-col md:flex-row">

        {/* ═══ IMAGE PANEL ═══ */}
        <div className="exp-image-panel w-full md:w-[52%] h-[55vw] md:h-auto md:min-h-screen relative flex-shrink-0">
          <Image
            src="/boombap-experience.jpg"
            alt="The Experience"
            fill
            sizes="(min-width: 768px) 52vw, 100vw"
            className="object-cover"
            priority
          />
          <div className="exp-image-overlay" />

          {/* Corner badge */}
          <div className="exp-corner-badge">
            <span className="exp-corner-badge-label">Location</span>
            <span className="exp-corner-badge-value">Bengaluru, IN</span>
          </div>

          {/* Vol stamp on image */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-sarpanch, 'Sarpanch', sans-serif)",
              fontSize: "clamp(80px, 14vw, 180px)",
              fontWeight: 900,
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.13)",
              whiteSpace: "nowrap",
              userSelect: "none",
              pointerEvents: "none",
              zIndex: 3,
              letterSpacing: "-0.03em",
            }}
          >
            VOL.02
          </div>

          {/* Ticker bar anchored to image bottom */}
          <div className="exp-ticker">
            <div className="exp-ticker-inner">
              {/* Duplicate for seamless loop */}
              {[...Array(2)].map((_, i) => (
                <span key={i} style={{ display: "inline-flex" }}>
                  {["Live Underground Sets", "Audio-Visual Installations", "Limited Access", "Bengaluru 2025", "Community of Sound"].map((item, j) => (
                    <span key={j} className="exp-ticker-item">
                      {item}
                      <span className="exp-ticker-dot" />
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ CONTENT PANEL ═══ */}
        <MotionReveal className="relative flex-1 flex flex-col justify-center exp-content">

          {/* Huge ghost numeral behind content */}
          <span className="exp-vol-number" aria-hidden="true">02</span>

          {/* Pill */}
          <div className="exp-pill relative z-10">The Experience</div>

          {/* Main heading */}
          <h2 className="exp-heading relative z-10">
            Vol. 02
            <span className="accent-line">Bengaluru</span>
          </h2>

          {/* Features */}
          <div className="exp-feature-grid relative z-10">
            {[
              {
                num: "01",
                title: "Masters of Underground",
                body: "Live sets from international artists at the edge of the underground.",
              },
              {
                num: "02",
                title: "Immersive AV Art",
                body: "Audio-visual installations that dissolve the line between sound and space.",
              },
              {
                num: "03",
                title: "Sound & Soul",
                body: "A gathering of people who feel music as much as they hear it.",
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="exp-feature-row">
                <span className="exp-feature-num">{num}</span>
                <p className="exp-feature-text">
                  <strong>{title}</strong>
                  {body}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="exp-cta-row relative z-10">
            <Link href="/tickets" className="boombap-button boombap-button--ghost">
              <ScrambleText text="Secure Tickets" />
            </Link>
            <span className="exp-divider-line" />
            <span className="exp-seats-hint">Limited seats</span>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}