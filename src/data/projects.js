import meterlyLogo from "../assets/logos/meterly-logo.png";
import karmLogo from "../assets/logos/karm-logo.png";
import mithaiLogo from "../assets/logos/mithai-logo.png";
import artLogo from "../assets/logos/art-logo.png";
import golfLogo from "../assets/logos/golf-logo.png";
import safeLeaseLogo from "../assets/logos/safelease-logo.png";

import saasImg from "../assets/saas-platform.png";
import karmImg from "../assets/karm-services.png";
import mithaiImg from "../assets/mithai-ghar.png";
import artifyImg from "../assets/artify-gallery.png";
import golfImg from "../assets/golf-charity.png";
import safeleaseImg from "../assets/safelease.png";

export const projects = [
  {
    num: "01",
    title: "SaaS Platform",
    category: "SaaS / Subscription Platform",
    logo: meterlyLogo,
    logoBg: "#000000",        // Meterly logo is white on black
    image: saasImg,
    description:
      "A scalable SaaS web application with authentication, dashboards, and a maintainable architecture built on Prisma ORM.",
    problem: "Needed a reusable foundation for subscription-based products with clean data modeling.",
    approach: "Built auth, role-based dashboards, and a normalized schema on Prisma ORM for fast iteration.",
    result: "A reusable base that lets new subscription products spin up in days, not weeks.",
    tech: ["React", "TypeScript", "Prisma", "Node.js"],
    github: "https://github.com/Janiyash/meterly-saas",
    demo: null,
    accent: "#B68944",
    featured: true,
  },
  {
    num: "02",
    title: "KARM Services Platform",
    category: "Service Platform",
    logo: karmLogo,
    logoBg: "#F5EDD8",        // Karm logo cream — matches logo bg eactly
    logoBlend: "multiply",    // removes white box around logo
    image: karmImg,
    description:
      "A service-based platform with booking management, user handling, and automated email integration to streamline requests and communication.",
    problem: "Manual booking coordination needed a self-service, automated workflow.",
    approach: "Added booking management, user handling, and automated email integration.",
    result: "Removed manual back-and-forth and gave users a self-service booking flow.",
    tech: ["React", "Firebase", "Tailwind CSS"],
    github: "https://github.com/Janiyash/karma-services",
    demo: null,
    accent: "#6E8FAE",
    featured: false,
  },
  {
    num: "03",
    title: "Mithai-Ghar",
    category: "E-commerce",
    logo: mithaiLogo,
    logoBg: "#ffffff",        // Mithai logo is on white
    image: mithaiImg,
    description:
      "A modern sweets & namkeen storefront showcasing traditional Indian mithai with an elegant UI and responsive product browsing.",
    problem: "Local mithai business needed a clean, fast, mobile-friendly digital storefront.",
    approach: "Designed a responsive product browsing experience with a focus on speed and clarity.",
    result: "A polished storefront the business could launch online with zero friction.",
    tech: ["React.js", "Next.js", "Tailwind CSS"],
    github: "https://github.com/Janiyash/mithai-ghar",
    demo: null,
    accent: "#C17A3A",
    featured: false,
  },
  {
    num: "04",
    title: "Artify Gallery",
    category: "Web App",
    logo: artLogo,
    logoBg: "#ffffff",        // Artify logo is on white
    image: artifyImg,
    description:
      "A dynamic art gallery management system with email integration via PHPMailer and a responsive, user-friendly interface.",
    problem: "Needed a structured way to manage and present gallery listings with contact workflows.",
    approach: "Built a management system with PHPMailer-driven contact workflows.",
    result: "Gave the gallery a structured, responsive way to manage listings and inquiries.",
    tech: ["PHP", "MySQL", "PHPMailer"],
    github: "https://github.com/Janiyash/Art-gallery-Management-System-",
    demo: null,
    accent: "#8B7355",
    featured: false,
  },
  {
    num: "05",
    title: "GolfCharity Platform",
    category: "SaaS / Subscription Platform",
    logo: golfLogo,
    logoBg: "#0f1a10",        // Golf logo — dark green so gold/white text is visible
    image: golfImg,
    description:
      "A golf-based subscription platform where users track scores, enter monthly prize draws, and contribute to charity — with Stripe billing and webhook-driven backend processing.",
    problem: "Required real-time dashboards backed by reliable subscription billing and webhook automation.",
    approach: "Wired up Stripe billing with webhook-driven backend processing and live dashboards.",
    result: "Reliable subscription billing with real-time score tracking and prize draws.",
    tech: ["Next.js", "Stripe", "Supabase", "Tailwind CSS"],
    github: "https://github.com/Janiyash/golf-saas",
    demo: null,
    accent: "#A0855B",
    featured: false,
  },
  {
    num: "06",
    title: "SafeLease",
    category: "Property Management Platform",
    logo: safeLeaseLogo,
    logoBg: "#ffffff",        // SafeLease logo is on white
    image: safeleaseImg,
    description:
      "A full-stack platform for tenants, owners, and admins to manage properties, rent cycles, complaints, and notices end-to-end.",
    problem: "Property lifecycle management was fragmented — no single platform handled tenants, owners, rent, and communications together.",
    approach: "Built automated rent cycle engine, email OTP two-factor auth, real-time notifications, and branded transactional email delivery.",
    result: "End-to-end property lifecycle management with automated billing, 2FA, and real-time tenant communication.",
    tech: ["React", "TypeScript", "Node.js", "Express", "MongoDB"],
    github: "https://github.com/Janiyash",
    demo: null,
    accent: "#7A8FA0",
    featured: false,
  },
];