"use client"

import DarkModeSwitcher from "@/components/darkmodeswitcher";
import { ColorSchemeContext } from "@/context/color-scheme";
import { DarkModeContext } from "@/context/darkmode";
import { Button, Container, TextField } from "@mui/material";
import QRCodeStyling, { Options, DrawType, TypeNumber, Mode, ErrorCorrectionLevel, DotType, CornerSquareType, CornerDotType } from "qr-code-styling";
import { useContext, useEffect, useRef, useState } from "react";
import { CatppuccinColors } from "@coding-club-gct/theme";

const generateOptions = (catppuccinColors: CatppuccinColors, darkMode: boolean, val: string): Options => {
  return {
    width: 300,
    height: 300,
    data: val,
    image: darkMode ? "/dark.png": "/light.png",
    margin: 0,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 3,
      margin: 10,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: catppuccinColors.yellow,
      type: 'extra-rounded' as DotType
    },
    backgroundOptions: {
      color: catppuccinColors.base,
    },
    cornersSquareOptions: {
      color: catppuccinColors.surface0,
      type: 'dot' as CornerSquareType,
    },
    cornersDotOptions: {
      color: catppuccinColors.yellow,
      type: 'dot' as CornerDotType,
    },
  }
}

export default function Home() {
  const catppuccinColors = useContext(ColorSchemeContext)
  const {darkMode} = useContext(DarkModeContext)

  const [val, setVal] = useState("https://codingclubgct.in")
  const [options] = useState<Options>(generateOptions(catppuccinColors, darkMode, val));
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && qrCode) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);
  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(generateOptions(catppuccinColors, darkMode, val));
  }, [qrCode, val, darkMode]);

  return <Container className="px-4 py-12 flex flex-col gap-12" maxWidth="md">
    <div className="flex items-center justify-between">
      <DarkModeSwitcher />
      <a className="text-blue no-underline" href="https://codingclubgct.in"> Coding Club GCT </a>
    </div>
    <div className="flex flex-col gap-2">
      <p className="text-3xl"> Official QR code Generator </p>
      <p className="text-subtext0"> Generating QR Codes in Harmony with the Club's Official Theme Palette </p>
    </div>
    <TextField label="Type here ..." value={val} onChange={(e) => setVal(e.target.value)} color="primary" />
    <div className="flex md:block justify-center">
      <div ref={ref}></div>
    </div>
    <Button onClick={() => qrCode.download({extension: "svg", name: "QR Code"})} className="ml-0 mr-auto" size="large"> Download </Button>
  </Container>
}
