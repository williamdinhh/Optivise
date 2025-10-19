import fs from "fs";
import path from "path";
import { SiteConfig, Variant } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize with default config if doesn't exist
const defaultConfig: SiteConfig = {
  currentVariant: "original",
  variants: [],
  originalVariant: {
    id: "original",
    name: "Original",
    description: "Airbnb-style vacation rental platform",
    html: `
      <div class="modern-container">
        <!-- Header -->
        <header class="header">
          <div class="header-content">
            <div class="logo">
              <div class="logo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span class="logo-text">Stripe</span>
            </div>
            <nav class="nav-menu">
              <a href="#" class="nav-link">Products</a>
              <a href="#" class="nav-link">Solutions</a>
              <a href="#" class="nav-link">Developers</a>
              <a href="#" class="nav-link">Resources</a>
              <a href="#" class="nav-link">Pricing</a>
            </nav>
            <div class="header-actions">
              <button class="sign-in-btn">Sign in</button>
              <button class="cta-btn">Start now</button>
            </div>
          </div>
        </header>

        <!-- Hero Section -->
        <section class="hero">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="badge-text">New</span>
              <span class="badge-description">Introducing Stripe Tax</span>
            </div>
            <h1 class="hero-title">
              Payments infrastructure for the internet
            </h1>
            <p class="hero-description">
              Millions of businesses of all sizes—from startups to large enterprises—use Stripe's software and APIs to accept payments, send payouts, and manage their businesses online.
            </p>
            <div class="hero-actions">
              <button class="primary-btn">Start now</button>
              <button class="secondary-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Contact sales
              </button>
            </div>
            <div class="hero-stats">
              <div class="stat">
                <div class="stat-number">99.99%</div>
                <div class="stat-label">Uptime</div>
              </div>
              <div class="stat">
                <div class="stat-number">$800B+</div>
                <div class="stat-label">Volume processed</div>
              </div>
              <div class="stat">
                <div class="stat-number">135+</div>
                <div class="stat-label">Countries</div>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="code-block">
              <div class="code-header">
                <div class="code-dots">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                </div>
                <span class="code-title">stripe.js</span>
              </div>
              <div class="code-content">
                <div class="code-line">
                  <span class="code-keyword">const</span> 
                  <span class="code-variable">stripe</span> = 
                  <span class="code-function">Stripe</span>(
                  <span class="code-string">'pk_live_...'</span>);
                </div>
                <div class="code-line">
                  <span class="code-keyword">const</span> 
                  <span class="code-variable">paymentIntent</span> = 
                  <span class="code-keyword">await</span> 
                  <span class="code-variable">stripe</span>.
                  <span class="code-function">confirmPayment</span>();
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="features">
          <div class="features-content">
            <h2 class="section-title">Built for developers, by developers</h2>
            <p class="section-description">
              Stripe's APIs are designed to be simple, powerful, and flexible. Build exactly what you need.
            </p>
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 class="feature-title">Payments</h3>
                <p class="feature-description">Accept payments online, in person, and around the world with our global payment processing platform.</p>
                <a href="#" class="feature-link">Learn more →</a>
              </div>
              <div class="feature-card">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 class="feature-title">Connect</h3>
                <p class="feature-description">Build marketplaces and platforms that enable businesses to accept payments and send payouts.</p>
                <a href="#" class="feature-link">Learn more →</a>
              </div>
              <div class="feature-card">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 class="feature-title">Billing</h3>
                <p class="feature-description">Create and manage subscriptions, invoices, and billing for your customers with our billing platform.</p>
                <a href="#" class="feature-link">Learn more →</a>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
          <div class="cta-content">
            <h2 class="cta-title">Ready to get started?</h2>
            <p class="cta-description">Create an account and start accepting payments in minutes.</p>
            <div class="cta-actions">
              <button class="primary-btn large">Start now</button>
              <button class="secondary-btn large">Contact sales</button>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
          <div class="footer-content">
            <div class="footer-brand">
              <div class="footer-logo">
                <div class="logo-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span>Stripe</span>
              </div>
              <p class="footer-description">
                The new standard in online payments.
              </p>
            </div>
            <div class="footer-links">
              <div class="footer-column">
                <h4>Products</h4>
                <ul>
                  <li><a href="#">Payments</a></li>
                  <li><a href="#">Billing</a></li>
                  <li><a href="#">Connect</a></li>
                  <li><a href="#">Payouts</a></li>
                </ul>
              </div>
              <div class="footer-column">
                <h4>Developers</h4>
                <ul>
                  <li><a href="#">Documentation</a></li>
                  <li><a href="#">API Reference</a></li>
                  <li><a href="#">SDKs</a></li>
                  <li><a href="#">Status</a></li>
                </ul>
              </div>
              <div class="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Press</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <div class="footer-legal">
              <span>© 2024 Stripe, Inc.</span>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </footer>
      </div>
    `,
    css: `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .modern-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #0a2540;
        line-height: 1.6;
        background: #ffffff;
      }

      /* Header */
      .header {
        position: sticky;
        top: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid #e6e6e6;
        z-index: 100;
      }

      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 72px;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #635bff;
        font-weight: 700;
        font-size: 24px;
      }

      .logo-icon {
        width: 32px;
        height: 32px;
        color: #635bff;
      }

      .nav-menu {
        display: flex;
        gap: 32px;
        align-items: center;
      }

      .nav-link {
        color: #425466;
        text-decoration: none;
        font-weight: 500;
        font-size: 15px;
        transition: color 0.2s;
      }

      .nav-link:hover {
        color: #0a2540;
      }

      .header-actions {
        display: flex;
        gap: 16px;
        align-items: center;
      }

      .sign-in-btn {
        background: none;
        border: none;
        color: #425466;
        font-weight: 500;
        font-size: 15px;
        cursor: pointer;
        padding: 8px 16px;
        border-radius: 8px;
        transition: background-color 0.2s;
      }

      .sign-in-btn:hover {
        background: #f6f9fc;
      }

      .cta-btn {
        background: #635bff;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .cta-btn:hover {
        background: #5a52d5;
        transform: translateY(-1px);
      }

      /* Hero Section */
      .hero {
        padding: 120px 0;
        background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
      }

      .hero-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 80px;
        align-items: center;
      }

      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #e3f2fd;
        color: #1976d2;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 24px;
      }

      .badge-text {
        background: #1976d2;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
      }

      .hero-title {
        font-size: 56px;
        font-weight: 700;
        line-height: 1.1;
        color: #0a2540;
        margin-bottom: 24px;
      }

      .hero-description {
        font-size: 20px;
        color: #425466;
        margin-bottom: 40px;
        line-height: 1.5;
      }

      .hero-actions {
        display: flex;
        gap: 16px;
        margin-bottom: 60px;
      }

      .primary-btn {
        background: #635bff;
        color: white;
        border: none;
        padding: 16px 32px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .primary-btn:hover {
        background: #5a52d5;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(99, 91, 255, 0.3);
      }

      .secondary-btn {
        background: white;
        color: #635bff;
        border: 1px solid #e6e6e6;
        padding: 16px 32px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s;
      }

      .secondary-btn:hover {
        background: #f6f9fc;
        transform: translateY(-2px);
      }

      .hero-stats {
        display: flex;
        gap: 48px;
      }

      .stat {
        text-align: left;
      }

      .stat-number {
        font-size: 32px;
        font-weight: 700;
        color: #0a2540;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 14px;
        color: #425466;
        font-weight: 500;
      }

      .hero-visual {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .code-block {
        background: #1e1e1e;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 500px;
      }

      .code-header {
        background: #2d2d2d;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .code-dots {
        display: flex;
        gap: 8px;
      }

      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }

      .dot.red { background: #ff5f56; }
      .dot.yellow { background: #ffbd2e; }
      .dot.green { background: #27ca3f; }

      .code-title {
        color: #ffffff;
        font-size: 14px;
        font-weight: 500;
      }

      .code-content {
        padding: 24px 20px;
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 14px;
        line-height: 1.6;
      }

      .code-line {
        margin-bottom: 8px;
      }

      .code-keyword { color: #c792ea; }
      .code-variable { color: #82aaff; }
      .code-function { color: #ffcb6b; }
      .code-string { color: #c3e88d; }

      /* Features Section */
      .features {
        padding: 120px 0;
        background: white;
      }

      .features-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
        text-align: center;
      }

      .section-title {
        font-size: 48px;
        font-weight: 700;
        color: #0a2540;
        margin-bottom: 24px;
      }

      .section-description {
        font-size: 20px;
        color: #425466;
        margin-bottom: 80px;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 48px;
      }

      .feature-card {
        text-align: left;
        padding: 40px;
        border-radius: 16px;
        background: #f6f9fc;
        transition: all 0.3s;
      }

      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }

      .feature-icon {
        width: 48px;
        height: 48px;
        background: #635bff;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;
        color: white;
      }

      .feature-title {
        font-size: 24px;
        font-weight: 700;
        color: #0a2540;
        margin-bottom: 16px;
      }

      .feature-description {
        font-size: 16px;
        color: #425466;
        margin-bottom: 24px;
        line-height: 1.6;
      }

      .feature-link {
        color: #635bff;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        transition: color 0.2s;
      }

      .feature-link:hover {
        color: #5a52d5;
      }

      /* CTA Section */
      .cta-section {
        padding: 120px 0;
        background: linear-gradient(135deg, #635bff 0%, #5a52d5 100%);
        color: white;
        text-align: center;
      }

      .cta-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 24px;
      }

      .cta-title {
        font-size: 48px;
        font-weight: 700;
        margin-bottom: 24px;
      }

      .cta-description {
        font-size: 20px;
        margin-bottom: 48px;
        opacity: 0.9;
      }

      .cta-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
      }

      .cta-actions .primary-btn {
        background: white;
        color: #635bff;
      }

      .cta-actions .primary-btn:hover {
        background: #f6f9fc;
      }

      .cta-actions .secondary-btn {
        background: transparent;
        color: white;
        border-color: rgba(255, 255, 255, 0.3);
      }

      .cta-actions .secondary-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .large {
        padding: 20px 40px;
        font-size: 18px;
      }

      /* Footer */
      .footer {
        background: #0a2540;
        color: white;
        padding: 80px 0 40px;
      }

      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 80px;
        margin-bottom: 60px;
      }

      .footer-brand {
        max-width: 300px;
      }

      .footer-logo {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        font-size: 24px;
        font-weight: 700;
        color: #635bff;
      }

      .footer-logo .logo-icon {
        width: 32px;
        height: 32px;
        color: #635bff;
      }

      .footer-description {
        font-size: 16px;
        color: #8898aa;
        line-height: 1.6;
      }

      .footer-links {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 48px;
      }

      .footer-column h4 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 24px;
        color: white;
      }

      .footer-column ul {
        list-style: none;
      }

      .footer-column li {
        margin-bottom: 12px;
      }

      .footer-column a {
        color: #8898aa;
        text-decoration: none;
        font-size: 14px;
        transition: color 0.2s;
      }

      .footer-column a:hover {
        color: white;
      }

      .footer-bottom {
        border-top: 1px solid #2d3748;
        padding-top: 40px;
      }

      .footer-legal {
        display: flex;
        gap: 32px;
        align-items: center;
        font-size: 14px;
        color: #8898aa;
      }

      .footer-legal a {
        color: #8898aa;
        text-decoration: none;
        transition: color 0.2s;
      }

      .footer-legal a:hover {
        color: white;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          height: auto;
          padding: 16px;
          gap: 16px;
        }

        .nav-menu {
          display: none;
        }

        .hero-content {
          grid-template-columns: 1fr;
          gap: 48px;
          text-align: center;
        }

        .hero-title {
          font-size: 40px;
        }

        .hero-actions {
          flex-direction: column;
          align-items: center;
        }

        .hero-stats {
          justify-content: center;
        }

        .features-grid {
          grid-template-columns: 1fr;
        }

        .footer-content {
          grid-template-columns: 1fr;
          gap: 48px;
        }

        .footer-links {
          grid-template-columns: 1fr;
          gap: 32px;
        }

        .footer-legal {
          flex-direction: column;
          gap: 16px;
          text-align: center;
        }
      }
    `,
    createdAt: new Date().toISOString(),
    isActive: true,
  },
};

if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
}

export function getConfig(): SiteConfig {
  try {
    const data = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return defaultConfig;
  }
}

export function saveConfig(config: SiteConfig): void {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function addVariant(variant: Variant): void {
  const config = getConfig();
  config.variants.push(variant);
  saveConfig(config);
}

export function removeVariant(variantId: string): void {
  const config = getConfig();
  config.variants = config.variants.filter((v) => v.id !== variantId);
  if (config.currentVariant === variantId) {
    config.currentVariant = "original";
  }
  saveConfig(config);
}

export function updateVariant(
  variantId: string,
  updates: Partial<Variant>
): void {
  const config = getConfig();
  const index = config.variants.findIndex((v) => v.id === variantId);
  if (index !== -1) {
    config.variants[index] = { ...config.variants[index], ...updates };
    saveConfig(config);
  }
}

export function setCurrentVariant(variantId: string): void {
  const config = getConfig();
  config.currentVariant = variantId;
  saveConfig(config);
}

export function getAllVariants(): Variant[] {
  const config = getConfig();
  return [config.originalVariant, ...config.variants];
}

export function getActiveVariants(): Variant[] {
  return getAllVariants().filter((v) => v.isActive);
}
