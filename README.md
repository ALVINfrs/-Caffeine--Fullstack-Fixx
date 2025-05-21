# ☕<Caffeine/> — Coffee Shop for Coders

**<Caffeine/>** adalah aplikasi fullstack bertema kedai kopi online yang dirancang khusus untuk programmer. Menghadirkan suasana cozy dan ramah ngoding, aplikasi ini memungkinkan pengguna untuk melihat menu, memesan minuman, melakukan checkout, dan mencetak struk langsung dari perangkat mereka.

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Next.js** — Framework React untuk SSR dan SPA
- **Tailwind CSS** — Utility-first CSS untuk styling cepat dan responsif
- **Radix UI + Shadcn/UI** — Komponen UI modern
- **React Hook Form + Zod** — Validasi form efisien
- **Recharts** — Visualisasi data
- **Lucide Icons** — Ikon modern dan ringan

### Backend
- **Express.js** — Web framework minimalis untuk REST API
- **MySQL (via mysql2)** — Database relasional
- **bcryptjs** — Enkripsi password
- **express-session** — Autentikasi berbasis session
- **dotenv, cors, body-parser** — Middleware pendukung
- **Midtrans API (Snap)** — Payment Gateway untuk pemrosesan transaksi online

---

## 📁 Struktur Folder

caffeine-fullstack/
├── backend/ # Backend Express API
├── frontend/ # Frontend Next.js App

markdown
Copy
Edit

---

## 🌐 Fitur Utama

### Umum
- Halaman navigasi: Home, Tentang Kami, Menu, Kontak Kami
- Desain dark theme yang cozy dan nyaman untuk programmer
- Fitur Login & Register user
- Desain responsif (mobile & desktop)

### Menu & Pemesanan
- Menampilkan daftar menu minuman dan makanan
- Checkout langsung di modal (`CheckoutModal.tsx`)
- Redirect ke halaman `successful-transaction.tsx` setelah pembayaran
- Receipt Modal: menampilkan riwayat pesanan dan cetak struk
- **Integrasi Midtrans Snap** untuk pembayaran cepat dan aman

---

## 💳 Integrasi Midtrans

Aplikasi ini telah terintegrasi dengan **Midtrans Snap** untuk memproses pembayaran secara real-time.

### 1. Daftar dan Dapatkan API Key
- Buat akun di [https://dashboard.midtrans.com](https://dashboard.midtrans.com)
- Masuk ke menu `Settings > Access Keys`
- Dapatkan:
  - `MIDTRANS_SERVER_KEY`
  - `MIDTRANS_CLIENT_KEY`

### 2. Tambahkan ke `.env` di `backend/`

env
MIDTRANS_SERVER_KEY=Your-Midtrans-Server-Key
MIDTRANS_CLIENT_KEY=Your-Midtrans-Client-Key
MIDTRANS_IS_PRODUCTION=false
3. Endpoint Backend (Contoh)
js
Copy
Edit
const midtransClient = require('midtrans-client');

router.post("/create-payment", async (req, res) => {
  const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey: process.env.MIDTRANS_SERVER_KEY,
  });

  const parameter = {
    transaction_details: {
      order_id: `ORDER-${Date.now()}`,
      gross_amount: req.body.amount,
    },
    credit_card: {
      secure: true,
    },
    customer_details: req.body.customer,
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    res.json({ snapToken: transaction.token });
  } catch (err) {
    res.status(500).json({ message: "Gagal membuat transaksi Midtrans." });
  }
});
4. Integrasi Frontend
tsx
Copy
Edit
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
  script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
  document.body.appendChild(script);
}, []);
🧠 Konsep Desain
Tempat ngopi bukan cuma tempat ngopi.

<Caffeine/> dirancang sebagai kafe virtual dan fisik bagi para developer, programmer, dan pecinta teknologi yang ingin:

Nugas, ngoding, atau meeting dengan nyaman

Menikmati aroma kopi dan alunan lo-fi playlist

Memesan menu favorit tanpa ganggu workflow

🚀 Cara Menjalankan Proyek
1. Clone repository
bash
Copy
Edit
git clone https://github.com/yourusername/caffeine-fullstack.git
cd caffeine-fullstack
2. Jalankan Backend
bash
Copy
Edit
cd backend
npm install
npm start
3. Jalankan Frontend
bash
Copy
Edit
cd ../frontend
npm install
npm run dev
4. Konfigurasi Environment (.env)
Backend .env:
env
Copy
Edit
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=caffeine_db
SESSION_SECRET=supersecretkey
MIDTRANS_SERVER_KEY=Your-Midtrans-Server-Key
MIDTRANS_CLIENT_KEY=Your-Midtrans-Client-Key
MIDTRANS_IS_PRODUCTION=false
Frontend .env.local (Next.js):
env
Copy
Edit
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Your-Midtrans-Client-Key
🙌 Kontribusi
Pull request terbuka untuk semua jenis kontribusi:

🚀 Penambahan fitur

🐛 Perbaikan bug

🎨 Peningkatan UI/UX

Langkah kontribusi:

Fork repo ini

Buat branch baru

Commit perubahan

Buat pull request

🧾 Lisensi
MIT License © 2025 — <Caffeine/> by Muhammad Alvin Faris

Made with ❤️ and ☕ by Developer @ <Caffeine/>
nginx
Copy
Edit
