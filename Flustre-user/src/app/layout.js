import "./globals.css";
import Nav from "../layout/user/Nav";
import Footer from "../layout/user/Footer";
import { WishlistProvider } from "./_components/context/WishlistContext";
import { Toaster } from "sonner";
import ReduxProvider from "../providers/ReduxProvider";
// import ReactQueryProvider from "../providers/ReactQueryProvider"; // Removed - no API calls needed
export const metadata = {
  title: "Flustre",
  description: "Flustre storefront",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/Logo/Favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <ReduxProvider>
          <WishlistProvider>
            <Nav />
            {children}
            <Footer />
          </WishlistProvider>
        </ReduxProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
