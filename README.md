# 🎯 Forge Resume

A modern, professional CV builder built with **Nuxt 4** and **Vue 3**. Create stunning resumes with multiple templates, real-time preview, and PDF export capabilities.

## ✨ Features

- **6 Professional Templates** - Modern, Classic, Minimal, Creative, Elegant, and Bold
- **Real-time Preview** - See changes instantly as you type
- **PDF Export** - Download your CV as a high-quality PDF
- **Save & Load** - Store multiple CVs locally
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark Mode Support** - Built-in theme switching
- **Form Validation** - Ensures data accuracy
- **Toast Notifications** - User-friendly feedback system

## 🛠️ Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/)
- **UI Framework**: [Vue 3](https://vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Nuxt UI](https://ui.nuxt.com/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/)
- **Type Safety**: TypeScript
- **Utilities**: [tailwind-variants](https://www.tailwind-variants.org/)

## 📦 Installation

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## 🚀 Development

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## 🏗️ Production

Build the application for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
forge-resume/
├── app/
│   ├── components/
│   │   ├── cv/              # CV-specific components
│   │   │   ├── Template*.vue    # CV templates
│   │   │   ├── CVSection.vue
│   │   │   ├── CVExperienceSection.vue
│   │   │   └── ...
│   │   └── ui/              # Reusable UI components
│   │       ├── Button.vue
│   │       ├── Input.vue
│   │       └── ...
│   ├── composables/         # Vue composables
│   │   ├── useCV.ts             # CV data management
│   │   ├── useTemplate.ts       # Template switching
│   │   ├── useSavedCVs.ts       # Local storage management
│   │   └── useToast.ts          # Toast notifications
│   ├── utils/               # Utility functions
│   │   ├── constants.ts         # App constants
│   │   ├── validation.ts        # Form validation
│   │   └── helpers.ts           # Helper functions
│   └── pages/
│       └── index.vue        # Main page
├── nuxt.config.ts           # Nuxt configuration
├── tailwind.config.ts       # Tailwind configuration
└── package.json
```

## 🎨 Available Templates

1. **Modern** - Clean and contemporary design
2. **Classic** - Traditional professional layout
3. **Minimal** - Simple and elegant
4. **Creative** - Bold and eye-catching
5. **Elegant** - Sophisticated and refined
6. **Bold** - Strong visual impact

## 🔧 Configuration

The project uses TypeScript for type safety. Configuration files:

- `nuxt.config.ts` - Nuxt framework configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `tsconfig.json` - TypeScript compiler options

## 📝 Usage

1. **Fill in your information** - Personal details, experience, education, skills, etc.
2. **Choose a template** - Select from 6 professional designs
3. **Preview in real-time** - See your CV update instantly
4. **Save your work** - Store multiple versions locally
5. **Export to PDF** - Download your finished CV

## 🌐 Deployment

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for deployment options:

- Vercel
- Netlify
- Cloudflare Pages
- And more...

## 📄 License

Private project - All rights reserved

## 🤝 Contributing

This is a private project. For questions or issues, please contact the maintainer.

---

Built with ❤️ using Nuxt 4 and Vue 3
