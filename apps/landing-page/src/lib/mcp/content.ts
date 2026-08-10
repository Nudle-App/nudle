// Public marketing content surfaced by the MCP server.
// Mirrors what the NUDLE landing page shows to visitors.

export const overview = {
  name: "NUDLE",
  tagline: "Smarter Learning. Connected Minds.",
  description:
    "NUDLE empowers educators and institutions with AI-driven tools for teaching, assessment, and learning analytics.",
  stats: [
    { label: "Students", value: "10K+" },
    { label: "Institutions", value: "500+" },
    { label: "Satisfaction", value: "98%" },
    { label: "Rating", value: "4.9/5 from 10,000+ educators" },
  ],
  primaryCtas: ["Get Started Free", "Watch Demo", "Request a Demo"],
};

export const features = [
  {
    title: "AI-Powered Insights",
    description:
      "Leverage artificial intelligence to gain deep insights into student performance and learning patterns.",
  },
  {
    title: "Real-Time Analytics",
    description:
      "Track progress and performance metrics with comprehensive dashboards and reporting tools.",
  },
  {
    title: "Collaborative Learning",
    description:
      "Foster collaboration between students, educators, and institutions with integrated communication tools.",
  },
  {
    title: "Instant Feedback",
    description:
      "Provide immediate feedback to students with automated assessment and grading systems.",
  },
  {
    title: "Secure & Compliant",
    description:
      "Enterprise-grade security with full compliance to educational data protection standards.",
  },
  {
    title: "Rich Content Library",
    description:
      "Access thousands of curriculum-aligned resources and learning materials.",
  },
];

export const audiences = {
  institutions: {
    headline: "Transform Your Institution with AI",
    summary:
      "Streamline operations, enhance teaching effectiveness, and improve student outcomes with a comprehensive platform.",
    benefits: [
      "Centralized dashboard for all school operations",
      "Real-time student performance analytics",
      "Automated administrative workflows",
      "Secure data management and compliance",
      "Customizable reporting and insights",
      "Integration with existing systems",
    ],
    cta: "Request a Demo",
  },
  students: {
    headline: "Your Personal AI Learning Assistant",
    summary: "Experience personalized learning powered by artificial intelligence.",
    benefits: [
      "Personalized Learning — AI adapts to your learning style and pace",
      "Goal Tracking — set and achieve your academic goals",
      "Progress Insights — visualize your learning journey",
      "24/7 AI Assistance — get help whenever you need it",
    ],
    cta: "Start Learning for Free",
  },
} as const;

export const testimonials = [
  {
    quote:
      "NUDLE has transformed how we teach and assess students. The AI insights are incredible and have helped us identify learning gaps early.",
    author: "Dr. Sarah Johnson",
    role: "Department Head",
    institution: "Stanford University",
  },
  {
    quote:
      "The analytics dashboard gives us real-time visibility into student performance across all programs. It's become essential to our operations.",
    author: "Michael Chen",
    role: "Dean of Students",
    institution: "MIT",
  },
  {
    quote:
      "As a student, having an AI assistant that understands my learning style has been game-changing. My grades have improved significantly.",
    author: "Emily Rodriguez",
    role: "Undergraduate Student",
    institution: "Harvard University",
  },
];
