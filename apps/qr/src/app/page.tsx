"use client"

import DarkModeSwitcher from "@/components/darkmodeswitcher";
import { Container } from "@mui/material";
import dynamic from "next/dynamic";

const QR = dynamic(() => import("../components/qr"), {ssr: false})

export default function Home() {
  
  return <Container className="px-4 py-12 flex flex-col gap-12" maxWidth="md">
    <div className="flex items-center justify-between">
      <DarkModeSwitcher />
      <a className="text-blue no-underline" href="https://codingclubgct.in"> Coding Club GCT </a>
    </div>
    <div className="flex flex-col gap-2">
      <p className="text-3xl"> Official QR code Generator </p>
      <p className="text-subtext0"> Generating QR Codes in Harmony with the Club's Official Theme Palette </p>
    </div>
    <QR />
  </Container>
}
