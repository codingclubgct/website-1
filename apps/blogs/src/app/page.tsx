import { Logo } from "@/components/logo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full min-h-[calc(100vh-3rem)] md:min-h-screen p-12 flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-center md:w-2/3 items-center gap-4">
        <Logo />
        <div>
          <p className="text-2xl"> Welcome to the <span className="text-red"> official </span> blog center of <span className="text-yellow"> Coding Club GCT! </span> </p>
        </div>
      </div>
      <div className="w-full p-4 rounded">
        <p className=""> Want to blog ? </p>
        <p> Head over to our <Link className="text-blue" href="/how-to-blog"> how to blog </Link> </p>
      </div>
    </div>
  )
}
