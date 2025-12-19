import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "StudyFlow",
  description: "Sistema de Gestão de Estudos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="antialiased">
        {children}
        {/* O Toaster fica aqui embaixo, invisível até ser chamado */}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}