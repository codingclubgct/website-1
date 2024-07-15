"use client"

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { signIn, useSession } from "next-auth/react"

export const UserBox = () => {
    const { data: session } = useSession();

    return <div>
        {session?.user ? <div className="flex flex-col gap-4 w-full justify-center items-center">
            <img className="h-[5rem] object-contain rounded-full" src={session.user.image!} alt="" />
            <p> Logged in as <span className="text-green"> {session.user.name} </span> </p>
        </div> : <Button onClick={() => signIn("github")} className="flex items-center gap-2 w-full mt-auto mb-0"> <span> Login with </span> <FontAwesomeIcon icon={faGithub} /> </Button>}
    </div>
}