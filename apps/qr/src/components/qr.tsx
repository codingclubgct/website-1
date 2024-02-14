"use client"

import { ColorSchemeContext } from "@/context/color-scheme"
import { DarkModeContext } from "@/context/darkmode"
import { CatppuccinColors } from "@coding-club-gct/theme"
import { TextField, Button } from "@mui/material"
import QRCodeStyling, { CornerDotType, CornerSquareType, DotType, ErrorCorrectionLevel, Mode, Options, TypeNumber } from "qr-code-styling"
import { useContext, useState, useRef, useEffect } from "react"

const generateOptions = (catppuccinColors: CatppuccinColors, darkMode: boolean, val: string): Options => {
    return {
        width: 300,
        height: 300,
        data: val,
        image: darkMode ? "/dark.png" : "/light.png",
        type: "svg",
        margin: 10,
        qrOptions: {
            typeNumber: 0 as TypeNumber,
            mode: 'Byte' as Mode,
            errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
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

export default function QR () {
    const catppuccinColors = useContext(ColorSchemeContext)
    const { darkMode } = useContext(DarkModeContext)

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
    }, [qrCode, val, darkMode, catppuccinColors]);

    return <>
        <TextField label="Type here ..." value={val} onChange={(e) => setVal(e.target.value)} color="primary" />
        <div className="flex md:block justify-center">
            <div ref={ref}></div>
        </div>
        <Button onClick={() => qrCode.download({ extension: "svg", name: "QR Code" })} className="ml-0 mr-auto" size="large"> Download </Button>
    </>
}