"use client";
const Footer = () => {
  return (
    <footer style={{ background: "#07080d", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-0">

        <div className="grid md:grid-cols-3 gap-8 pb-7">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "#6366f1", boxShadow: "0 0 8px rgba(99,102,241,0.7)" }}
              />
              <span
                className="text-3xl font-semibold"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                DocMind
              </span>
            </div>
            <p
              className="text-xl leading-relaxed"
              style={{ color: "#a0a0a0" }}
            >
              Intelligent document analysis. Ask questions, get answers — powered by AI.
            </p>
          </div>

          {/* Navigation */}
          <div>
           
            {["Home", "Dashboard", "About", "Contact"].map((label) => (
              <a
                key={label}
                href="#"
                className="block text-xl mb-2 transition-colors"
                style={{ color: "#a0a0a0" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.75)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#a0a0a0")
                }
              >
                {label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p
              className="text-xl font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#a0a0a0" }}
            >
              Contact
            </p>
            <div className="space-y-2">
              <p className="text-l" style={{ color: "#a0a0a0" }}>
                vaibhavning@gmail.com
              </p>
              <p className="text-l" style={{color: "#a0a0a0" }}>
                <a
                  href="https://github.com/vaibhav666-glitch"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "rgba(99,102,241,0.7)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(99,102,241,1)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(99,102,241,0.7)")
                  }
                >
                  github.com/vaibhav666-glitch
                </a>
              </p>
              <p className="text-l" style={{color: "#a0a0a0" }}>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "rgba(99,102,241,0.7)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(99,102,241,1)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(99,102,241,0.7)")
                  }
                >
                  @Instagram
                </a>
              </p>
              <p className="text-l" style={{color: "#a0a0a0" }}>
                <a
                  href="https://www.linkedin.com/in/vaibhav-kumar-0a9085208/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "rgba(99,102,241,0.7)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(99,102,241,1)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(99,102,241,0.7)")
                  }
                ></a>
                @LinkedIn
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between py-4"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}
        >
          <span
            className="text-xl"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            © 2026 DocMind. All rights reserved.
          </span>
          <div className="flex items-center gap-2">
            {["AI Powered", "v1.0"].map((label) => (
              <span
                key={label}
                className="text-xl px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(99,102,241,0.08)",
                  border: "0.5px solid rgba(99,102,241,0.15)",
                  color: "rgba(99,102,241,0.6)",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;