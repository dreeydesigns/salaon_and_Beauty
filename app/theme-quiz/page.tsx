import type { Metadata } from "next";

import { ThemeQuizFlow } from "@/components/theme-quiz-flow";

export const metadata: Metadata = {
  title: "Find Your Beauty World",
  description: "A short Mobile Salon quiz that personalises your client signup and beauty discovery feed.",
};

export default function ThemeQuizPage() {
  return <ThemeQuizFlow />;
}
