import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "EducaRede | Portal do Professor & Rendimento Acadêmico",
  description: "Plataforma de gestão de notas, turmas e rendimento escolar para professores",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={plusJakartaSans.variable}>
      <body>{children}</body>
    </html>
  );
}

