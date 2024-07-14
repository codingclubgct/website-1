import entries from "@/data/entries.json" ;
import { Button } from "@mui/material";

export default function Home() {
  return <div className="flex flex-col gap-4 m-4 w-full">
    <div className="flex justify-center">
        <p className="text-2xl">Welcome to Coding Club  Webring</p>
    </div>
    {
      entries.map((data,i)=><div key={i} className="flex justify-around gap-4 m-4" >
       
        <a href={data.portfolio}>{data.portfolio}</a>
        <p>{data.slug}</p>

        </div>
        )
    }
    <div className="flex justify-center gap-8 m-8">
      <Button href="https://webring.codingclubgct.in/webring/back" >Back</Button>
      <Button href="https://webring.codingclubgct.in/webring/next">Next</Button>
    </div>
    
  </div>
}
