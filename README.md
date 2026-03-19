# 🍽️ Athithi Delight – Digital Menu (Vite + React)

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (opens at http://localhost:3000)
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
athithi-menu/
├── index.html                    ← Vite HTML entry
├── vite.config.js                ← Vite config
├── package.json                  ← qrcode + react + vite deps
└── src/
    ├── main.jsx                  ← React root + BrowserRouter
    ├── App.jsx                   ← Routes: / and /qr
    ├── index.css                 ← Global CSS variables & animations
    ├── data/
    │   └── menu.js               ← All 300+ items from your menu card
    └── components/
        ├── MenuPage.jsx          ← Beautiful menu UI (QR scan target)
        ├── MenuPage.css
        ├── QRPage.jsx            ← QR generator (uses qrcode npm)
        └── QRPage.css
```

---

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/`   | Full restaurant menu — dark gold luxury design |
| `/qr` | QR code generator — enter URL, generate, download/print |

---

## 🔧 Deploy & Use

### 1. Deploy to Vercel (easiest)
```bash
npm install -g vercel
vercel
# Copy your live URL e.g. https://athithi-delight.vercel.app
```

### 2. Deploy to Netlify
```bash
npm run build
# Drag the dist/ folder to netlify.com
```

### 3. Generate your QR code
1. Open `https://your-domain.com/qr`
2. Your URL is pre-filled automatically
3. Click **Generate QR Code**
4. **Download PNG** or **Print**
5. Place the QR code on your table, entrance, or menu board

### 4. Customers scan → see full menu at `/`

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18 | UI framework |
| `react-dom` | ^18 | DOM rendering |
| `react-router-dom` | ^6 | Client-side routing |
| `qrcode` | ^1.5.3 | QR code generation (npm package) |
| `vite` | ^5 | Build tool |
| `@vitejs/plugin-react` | ^4 | React JSX transform |

---

## ✨ Features

- **QR code** generated with `qrcode` npm (`QRCode.toDataURL()`)
- High error-correction level H — works if printed small or slightly worn
- Download as PNG or print directly
- Live search across all dishes
- Scroll-spy category tabs — auto-highlights as you scroll
- 🟢 Veg / 🔴 Non-Veg / 🟡 Egg badges on every item
- Mobile-first responsive (tabs collapse to emoji-only on small screens)
- Luxury dark gold aesthetic using Cormorant Garamond + DM Sans fonts
