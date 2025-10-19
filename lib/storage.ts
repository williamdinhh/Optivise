import { SiteConfig, Variant } from "@/types";

// Vercel-compatible storage using environment variables
// This is a simple in-memory storage that resets on each serverless function invocation
// For production, you'd want to use a database like Vercel KV, Supabase, or similar

let memoryConfig: SiteConfig | null = null;

// Initialize with default config if doesn't exist
const defaultConfig: SiteConfig = {
  currentVariant: "original",
  variants: [],
  originalVariant: {
    id: "original",
    name: "Original",
    description: "Stripe payments platform",
    html: `
      <div class="container">
        <!-- Header -->
        <header class="header">
          <div class="logo">Stripe</div>
          <nav>
            <a href="#">Products</a>
            <a href="#">Pricing</a>
          </nav>
          <div class="actions">
            <button class="signin">Sign in</button>
            <button class="cta">Start now</button>
          </div>
        </header>

        <!-- Hero Section -->
        <section class="hero">
          <h1>Payments for the internet</h1>
          <p>Accept payments online with Stripe's simple APIs.</p>
          <div class="buttons">
            <button class="primary">Get started</button>
            <button class="secondary">Learn more</button>
          </div>
        </section>

        <!-- Features Section -->
        <section class="features">
          <h2>Why choose Stripe?</h2>
          <div class="feature-grid">
            <div class="feature">
              <h3>Easy Integration</h3>
              <p>Simple APIs that work with any platform.</p>
            </div>
            <div class="feature">
              <h3>Global Payments</h3>
              <p>Accept payments from customers worldwide.</p>
            </div>
            <div class="feature">
              <h3>Secure</h3>
              <p>Bank-level security for all transactions.</p>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta">
          <h2>Ready to get started?</h2>
          <p>Create an account and start accepting payments in minutes.</p>
          <button class="cta-button">Start now</button>
        </section>

        <!-- Footer -->
        <footer class="footer">
          <div class="footer-content">
            <div class="footer-logo">Stripe</div>
            <div class="footer-links">
              <a href="#">Products</a>
              <a href="#">Developers</a>
              <a href="#">Company</a>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© 2024 Stripe, Inc.</span>
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

      .container {
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.6;
      }

      /* Header */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: white;
        border-bottom: 1px solid #eee;
      }

      .logo {
        font-size: 24px;
        font-weight: bold;
        color: #635bff;
      }

      nav {
        display: flex;
        gap: 20px;
      }

      nav a {
        text-decoration: none;
        color: #666;
      }

      .actions {
        display: flex;
        gap: 10px;
      }

      .signin {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
      }

      .cta {
        background: #635bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
      }

      /* Hero Section */
      .hero {
        text-align: center;
        padding: 80px 20px;
        background: #f8f9fa;
      }

      .hero h1 {
        font-size: 48px;
        margin-bottom: 20px;
        color: #333;
      }

      .hero p {
        font-size: 20px;
        margin-bottom: 30px;
        color: #666;
      }

      .buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
      }

      .primary {
        background: #635bff;
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
      }

      .secondary {
        background: white;
        color: #635bff;
        border: 1px solid #635bff;
        padding: 15px 30px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
      }

      /* Features Section */
      .features {
        padding: 60px 20px;
        text-align: center;
      }

      .features h2 {
        font-size: 36px;
        margin-bottom: 40px;
        color: #333;
      }

      .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        max-width: 800px;
        margin: 0 auto;
      }

      .feature {
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .feature h3 {
        font-size: 20px;
        margin-bottom: 10px;
        color: #333;
      }

      .feature p {
        color: #666;
      }

      /* CTA Section */
      .cta {
        text-align: center;
        padding: 60px 20px;
        background: #635bff;
        color: white;
      }

      .cta h2 {
        font-size: 36px;
        margin-bottom: 20px;
      }

      .cta p {
        font-size: 18px;
        margin-bottom: 30px;
        opacity: 0.9;
      }

      .cta-button {
        background: white;
        color: #635bff;
        border: none;
        padding: 15px 30px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
      }

      /* Footer */
      .footer {
        background: #333;
        color: white;
        padding: 40px 20px 20px;
      }

      .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .footer-logo {
        font-size: 20px;
        font-weight: bold;
      }

      .footer-links {
        display: flex;
        gap: 20px;
      }

      .footer-links a {
        color: #ccc;
        text-decoration: none;
      }

      .footer-bottom {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid #555;
        color: #999;
      }

    `,
    createdAt: new Date().toISOString(),
    isActive: true,
  },
};

export function getConfig(): SiteConfig {
  // Return memory config if available, otherwise return default
  return memoryConfig || defaultConfig;
}

export function saveConfig(config: SiteConfig): void {
  // Store in memory (resets on each serverless function invocation)
  memoryConfig = config;
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
