import { NextResponse } from "next/server";
import entries from "@/data/entries.json";

export async function GET(req: Request,{ params }: { params: { slug: string[] } }) 
{
  let redirectUrl = "/"; 
  for (let i = 0; i < entries.length; i++) {
    const { portfolio, slug } = entries[i];

    
    if (params.slug[0] === slug) {
      
      if (params.slug[1] === "back") {
        redirectUrl = i === 0 ? entries[entries.length - 1].portfolio : entries[i - 1].portfolio;
      } else if (params.slug[1] === "next") {
        redirectUrl = i === entries.length - 1 ? entries[0].portfolio : entries[i + 1].portfolio;
      }

      break; 
  }
  }
  console.log(`Redirecting to: ${redirectUrl}`);

  
  return new NextResponse("", {
    status: 302,
    headers: {
      Location: redirectUrl
    }
  });
}
