import "./globals.css";
import { Nunito_Sans } from "next/font/google";
import { AuthProvider } from "@/context/authContext";

const inter = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
import ToastContainer from "@/services/toast/ToastContainer";
import "material-icons/iconfont/material-icons.css";

export const metadata = {
  title: "Pillar 9 Login page",
  description: "Pillar 9 provides a streamlined technology experience for Alberta REALTORS®, providing access to listing data in a single-point system. Subscribers will have improved buying power, access to new products and services, enhanced client service, control over their data, plus the ability to conduct business on one MLS® System.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
