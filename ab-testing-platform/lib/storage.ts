import fs from 'fs';
import path from 'path';
import { SiteConfig, Variant } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize with default config if doesn't exist
const defaultConfig: SiteConfig = {
  currentVariant: 'original',
  variants: [],
  originalVariant: {
    id: 'original',
    name: 'Original',
    description: 'Original version of the website',
    html: `
      <div class="hero-section">
        <h1>Welcome to Our Amazing Product</h1>
        <p>Transform your business with our innovative solution</p>
        <button class="cta-button">Get Started Now</button>
      </div>
      <div class="features-section">
        <div class="feature">
          <h3>Fast & Reliable</h3>
          <p>Lightning fast performance guaranteed</p>
        </div>
        <div class="feature">
          <h3>Easy to Use</h3>
          <p>Intuitive interface for everyone</p>
        </div>
        <div class="feature">
          <h3>24/7 Support</h3>
          <p>Always here when you need us</p>
        </div>
      </div>
    `,
    css: `
      .hero-section {
        text-align: center;
        padding: 80px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        margin-bottom: 40px;
      }
      
      .hero-section h1 {
        font-size: 3rem;
        margin-bottom: 20px;
        font-weight: bold;
      }
      
      .hero-section p {
        font-size: 1.5rem;
        margin-bottom: 30px;
        opacity: 0.9;
      }
      
      .cta-button {
        background-color: #fff;
        color: #667eea;
        padding: 16px 40px;
        font-size: 1.1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      }
      
      .features-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        padding: 20px;
      }
      
      .feature {
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.2s;
      }
      
      .feature:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 12px rgba(0,0,0,0.15);
      }
      
      .feature h3 {
        color: #667eea;
        margin-bottom: 10px;
        font-size: 1.5rem;
      }
      
      .feature p {
        color: #666;
        line-height: 1.6;
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
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
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
  config.variants = config.variants.filter(v => v.id !== variantId);
  if (config.currentVariant === variantId) {
    config.currentVariant = 'original';
  }
  saveConfig(config);
}

export function updateVariant(variantId: string, updates: Partial<Variant>): void {
  const config = getConfig();
  const index = config.variants.findIndex(v => v.id === variantId);
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
  return getAllVariants().filter(v => v.isActive);
}

