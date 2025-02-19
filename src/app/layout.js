import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorProvider } from "@/context/ErrorContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { NotificationProvider } from "@/context/NotificationContext";
import { PermissionsProvider } from "@/context/PermissionsContext";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Omnichannel CRM",
  description: "NativeTalk Omnichannel CRM",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <Script src="https://js.paystack.co/v1/inline.js" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ErrorProvider>
            <PermissionsProvider>
                <NotificationProvider>
                  {children}
                  <ToastContainer
                      position="bottom-left"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      draggable
                      pauseOnHover
                  />
                </NotificationProvider>
            </PermissionsProvider>
          </ErrorProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}
