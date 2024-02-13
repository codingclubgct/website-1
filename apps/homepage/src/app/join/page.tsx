"use client"
import { SessionType } from "@/lib/auth";
import { Button, Container, Step, StepButton, StepConnector, StepContent, StepLabel, Stepper } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";

export default function Join() {
    const { data: session } = useSession() as { data: SessionType | null }
    const [nick, setNick] = useLocalStorageState("nick", { defaultValue: "" })
    const [activeStep, setActiveStep] = useState(0)
    const [status, setStatus] = useState<number>()

    useEffect(() => {
        if (!session) return setActiveStep(0)
        if (session?.provider === "google") {
            setNick(session.user?.name!)
            setActiveStep(1)
            return
        }
        if ((session?.provider === "discord") && nick) {
            fetch("/api/discord/add-member", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    access_token: session.access_token,
                    nick
                })
            }).then(res => {
                setStatus(res.status)
                setActiveStep(2)
            })
            return
        }
    }, [session, nick])

    const steps = [
        {
            component: (<div className="bg-mantle max-w-[500px] p-4 rounded flex flex-col gap-4">
                <p> Allow us to verify if you belong to our internal organization, which is <a className="text-blue" href="https://gct.ac.in"> gct.ac.in </a>.</p>
                <Button className="w-20" variant="outlined" onClick={() => signIn("google")}> Sign In </Button>
            </div>),
            label: "Authenticate with Google"
        },
        {
            component: (<div className="bg-mantle max-w-[500px] p-4 rounded flex flex-col gap-4">
                <p> We use Discord as our main platform for communication, allow us to automatically add you in our official discord server. If you are already present in the server, the process would assign you the Verified role. </p>
                <Button className="w-20" variant="outlined" onClick={() => signIn("discord")}> Sign In </Button>
            </div>),
            label: "Authenticate with Discord"
        },
        {
            component: (<div className="bg-mantle max-w-[500px] p-4 rounded flex flex-col gap-4">
                {status === 202 ? <p> <span className="text-green"> {nick}, </span> you are already present in our server, we might have given you the verified role by now, if you haven't had it. </p> : <p> Welcome to our Discord Server! <span> {nick}! </span> Bugs are just unexpected features waiting to be discovered </p>}
                <p> You can sign out now if you wish. </p>
                <Button className="w-24" variant="outlined" onClick={() => signOut()}> Sign Out </Button>
            </div>),
            label: "Voila !"
        }
    ]

    return <Container className="px-4">
        <div className="flex flex-col my-12 gap-4">
            <p className="text-3xl"> Join our Discord Server </p>
            <p className="md:max-w-[500px]"> Dive into the coding realm with our vibrant community! Join our Coding Club Discord server for collaborative programming sessions, knowledge exchange, and a supportive environment. Elevate your coding skills and connect with like-minded enthusiasts today! </p>
        </div>
        <div className="my-4">
            <Stepper orientation="vertical" activeStep={activeStep}>
                {steps.map((step, i) => <Step key={i}>
                    <StepLabel> {step.label} </StepLabel>
                    <StepContent> {step.component} </StepContent>
                </Step>)}
            </Stepper>
        </div>


    </Container>
}