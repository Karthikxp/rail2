## Railway Tracker
A modern, production-ready Next.js boilerplate with TypeScript, Tailwind CSS, and beautiful UI components.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **ESLint** for code quality
- **PostCSS** for CSS processing
- **Responsive design** that works on all devices
- **SEO optimized** with proper meta tags
- **Modern development** tools and best practices

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd nextjs-boilerplate
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                  # App Router pages and layouts
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── about/           # About page
├── components/          # Reusable UI components
│   └── ui/             # Base UI components
├── lib/                # Utility functions
├── public/             # Static assets
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## 🎨 Customization

### Colors

Update the color palette in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
    },
  },
}
```

### Fonts

The project uses Inter font from Google Fonts. You can change it in `app/layout.tsx`:

```typescript
import { YourFont } from 'next/font/google'

const yourFont = YourFont({ subsets: ['latin'] })
```

## 📱 Responsive Design

The boilerplate is built with mobile-first responsive design principles:

- Mobile: Default styles
- Tablet: `md:` prefix (768px and up)
- Desktop: `lg:` prefix (1024px and up)
- Large Desktop: `xl:` prefix (1280px and up)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically on every push

### Other Platforms

- **Netlify**: Connect your GitHub repo
- **Railway**: Use the Railway CLI
- **Docker**: Build with the included Dockerfile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)
- [TypeScript](https://www.typescriptlang.org/) 