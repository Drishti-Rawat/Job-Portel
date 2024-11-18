
import "./globals.css";

import { ThemeProvider } from "../components/theme-provider";
import Header from "../components/shared/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from '@clerk/themes';
import Footer from "@/components/shared/Footer";


export const metadata = {
  title: "HireX",
  description: "HireX is a job board for developers",
};



const PUBLISHABLEKEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
if(!PUBLISHABLEKEY) throw new Error("Missing Publishable Key")
export default function RootLayout({ children }) {
  return (
    <ClerkProvider  publishableKey={PUBLISHABLEKEY} appearance={{baseTheme:shadesOfPurple}}   afterSignOutUrl="/">
    <html lang="en" suppressHydrationWarning>
      <body>
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="grid-background  ">  </div>
          <main className=" container min-h-screen">
            <Header/>
        {children}
     
     
          </main>
        <Footer/>
            
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
