"use client"
import { events } from "@/lib/events"
import car from "@/assests/img.png"
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faBookmark, faCalendar, faCalendarDays, faComment, faEarth, faEnvelope, faHeart, faLocationDot, faPeopleGroup, faSave, faTag, faUpload, faUser } from "@fortawesome/free-solid-svg-icons"
import { DarkModeContext } from "@/context/darkmode";


export default function Page({ params: { slug } }: { params: { slug: string } }) {
  const event = events.find((item) => item.slug === slug)
  const [current, setCurrent] = useState(0)
  const { darkMode } = useContext(DarkModeContext)


  return <div>
    <div className="">
      <div className="flex gap-4 p-4 ">
        <img className="w-20  object-contain" src={darkMode ? "/dark.png" : "/light.png"} alt="" />
        <p className="text-4xl my-4 text-subtext0">{event?.name}</p>
      </div>
      <div className="mx-8 my-4">
        <div className="w-full object-contain flex p-2 mx-2 gap-2">
          <FontAwesomeIcon icon={faCalendarDays} className="w-6 h-6 text-pink" ></FontAwesomeIcon>
          <p className="text-subtext0 text-2xl">{event?.date}</p>
          <FontAwesomeIcon icon={faLocationDot} className="w-6 h-6 text-pink" ></FontAwesomeIcon>
          <p className="text-subtext0 text-2xl">{event?.venue}</p>
        </div>
      </div>
      <div>
         
      </div>
      {/* <div className="p-8 mx-4 gap-8 w-full">
        <p className="text-4xl w-1/3">{event?.about}</p>
        <div className="w-24 h-1 bg-pink my-6 mx-2"></div>
        <p className="text-xl ">{event?.content}</p>
      </div> */}
    </div>
  </div >
}