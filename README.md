💈 BarberSaaS
The Ultimate Multi-tenant Booking Platform for Modern Barbershops.

📌 Overview
BarberSaaS is a robust, multi-tenant "Software as a Service" platform designed to streamline scheduling for barbershops. Built with a focus on speed and user experience, it allows shop owners to manage their business while providing clients with a seamless, 24/7 mobile-first booking interface.

Currently focused on the Franca, SP region, the platform supports dynamic sub-pages for each registered shop (e.g., barbersaas.com/barbearia-gabriel).

🚀 Features
Multi-tenant Architecture: Dynamic routing based on slugs to serve multiple barbershops from a single codebase.

Smart Search & Autocomplete: Landing page with real-time shop discovery using Supabase's fuzzy search.

Comprehensive Booking Flow: 3-step scheduling (Service → Professional → Date/Time).

Admin Dashboard: Real-time statistics, revenue tracking, and appointment management.

Secure Authentication: User and Owner roles managed via Supabase Auth with custom profiles.

WhatsApp Integration: Direct "Confirm Appointment" buttons for barbers to communicate with clients.

Mobile-First Design: Fully responsive UI built with Tailwind CSS for the best experience on any device.

🛠 Tech Stack
Frontend: React + Vite

Styling: Tailwind CSS

Backend/Database: Supabase (PostgreSQL + Auth)

Icons: Lucide React

Date Handling: date-fns

🏗 Project Structure
Plaintext
src/
├── components/     # Reusable UI components (Header, MobileNav, Auth)
├── pages/          # Main application views (Home, Booking, Dashboard, NotFound)
├── services/       # Supabase client configuration
├── types/          # TypeScript interfaces and types
└── App.tsx         # Main router and authentication logic
⚙️ Installation & Setup
Clone the repository:

Bash
git clone https://github.com/your-username/barber-saas.git
cd barber-saas
Install dependencies:

Bash
npm install
Environment Variables:
Create a .env file in the root directory and add your Supabase credentials:

Snippet de código
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Run the development server:

Bash
npm run dev
🗺 Roadmap
[x] Multi-tenant dynamic routing

[x] Real-time dashboard with revenue stats

[x] Client/Admin Auth roles

[ ] Automated Email/WhatsApp reminders

[ ] Stripe/Pix payment integration

[ ] Monthly reporting for shop owners

📄 License
This project is under the MIT License.

Gabriel, este README resume bem o seu projeto de agendamento de barbearia. O que acha de eu te ajudar a criar uma página de "Preços" (Pricing) na Home para mostrar os planos do seu SaaS? Seria um próximo passo legal para profissionalizar ainda mais!