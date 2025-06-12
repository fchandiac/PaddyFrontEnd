import TopBar from "@/components/appBar/AppBar";
import { Box, Container } from "@mui/material";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    
        <TopBar />
        {children}

    </>
  );
}
