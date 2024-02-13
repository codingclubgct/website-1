"use client"

import { DarkModeContext } from "@/context/darkmode"
import { Container, Divider } from "@mui/material"
import { useContext } from "react"
import hrLight from "@/assets/logos/hr/light.png"
import hrDark from "@/assets/logos/hr/dark.png"
import { faCalendar, faGlobe, faPeopleGroup, faUsers } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const items = [
    {
        title: "Event Management",
        content: "The Operations and HR team plays a crucial role in planning, organizing, and executing various events within the coding club. This includes coding competitions, workshops, and social gatherings, ensuring smooth logistics and a positive experience for all members.",
        icon: faCalendar
    },
    {
        title: "Internal Affairs and Coordination",
        content: "Members of the Operations and HR team are responsible for internal affairs, fostering a collaborative and inclusive environment. They facilitate communication among club members, coordinate team activities, and address any concerns to ensure a cohesive and supportive community.",
        icon: faPeopleGroup
    },
    {
        title: "External Relations and Networking",
        content: "The team actively engages in building external relationships and networking opportunities. This involves collaborating with other clubs, organizations, and industry professionals to create partnerships, seek sponsorships, and provide members with valuable connections and opportunities beyond coding itself.",
        icon: faGlobe
    }
];

export default function Activities() {
    const { darkMode } = useContext(DarkModeContext)
    return <Container>
        <div className="flex flex-col gap-4 my-12">
            <p className="text-4xl"> Innovate & Collaborate: The CodeCrafters Collective </p>
            <p> Embark on a coding journey where creativity thrives, events unfold seamlessly, and human resources are empowered. Join our Coding Club's specialized teams for Operations and HR – where code meets excellence in every aspect. </p>
            <p> Explore diverse roles within our club, where you can contribute your unique skills and talents, even if coding isn't your primary focus - because in our coding club, everyone has a place to shine. </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:p-4">
            <div className="md:w-1/3">
                <img src={darkMode ? hrDark.src : hrLight.src} className="w-full object-contain" alt="" />
            </div>
            <div className="md:w-2/3">
                <p className="text-2xl"> Operations and HR team </p>
                <div className="my-4 bg-mantle p-4 rounded flex flex-col gap-4">
                    {items.map((item, i) => <div className="flex flex-col gap-4" key={i}>
                        <div className="flex gap-4">
                            <FontAwesomeIcon className="text-xl text-red mt-1" icon={item.icon} />
                            <div className="flex flex-col gap-4">
                                <p className="text-lg text-red"> {item.title} </p>
                                <p> {item.content} </p>
                            </div>
                        </div>
                        <Divider />
                    </div>)}
                </div>
            </div>
        </div>
    </Container>
}