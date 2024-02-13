"use client"
import Blog from "@/components/blog";
import { Button, Divider, Container, useMediaQuery } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import Services from "@/components/services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCode } from "@fortawesome/free-solid-svg-icons";
import dark from "@/assets/dark.png"
import light from "@/assets/light.png"
import { DarkModeContext } from "@/context/darkmode"
import Link from "next/link";

export default function Page() {
  const [repoCount, setRepoCount] = useState<number | null>(null);
  const [membersCount, setMembersCount] = useState<number | null>(null);
  const { darkMode } = useContext(DarkModeContext)

  useEffect(() => {
    const fetchRepoCount = async () => {
      try {
        const response = await fetch(`https://api.github.com/orgs/coding-club-gct`, {
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
          }
        }).then(res => res.json());
        setRepoCount(response.public_repos);
      } catch (error) {
        console.error('Error fetching organization repository count:', error);
      }
    };
    async function fetchMemberCount() {
      await fetch("/api/discord/members").then(res => res.json()).then(data => setMembersCount(data.approximate_member_count));
    }
    fetchRepoCount();
    fetchMemberCount()
  }, []);

  return <div>
    <div>
      <div className="flex justify-center md:my-12 mb-12" >
        <Container className="gap-4 flex flex-col md:flex-row justify-around p-0">
          <div className="flex justify-center w-full mt-12 md:mt-0 md:w-1/3 md:h-full ">
            <div className="w-3/4 h-full">
              <img src={darkMode ? dark.src : light.src} className="object-contain w-full ">
              </img>
            </div>
          </div>
          <div className="h-full md:w-2/3 w-full flex flex-col gap-4 p-4">
            <p className="text-6xl">Not a <span className="text-yellow">Rocket</span> Science</p>
            <div className="flex justify-center">
              <p className=" text-lg md:w-3/4  ">Learn • Code • Develop • Share • Repeat</p>
            </div>
            <div className="flex justify-center  md:w-3/4  gap-4 my-4">
              <Link href="https://github.com/coding-club-gct">
                <Button variant="contained" >Collab on GitHub </Button>
              </Link>
              <Link href="/join">
                <Button variant="outlined"  >Join with Discord</Button>
              </Link>
            </div>
            <Divider></Divider>
            <p>Unlocking possibilities with every keystroke in our coding adventure!</p>
            <div className="flex gap-4">
              <div className=" flex flex-col p-4 gap-4 bg-mantle">
                <p className="text-xl font-medium">Repositories in our GitHub</p>
                {repoCount !== null ? (
                  <p className="text-3xl text-subtext0">
                    {repoCount} <span className="text-lg">+</span>
                  </p>
                ) : (
                  <p className="text-xl  text-subtext0 ">Loading...</p>
                )}
              </div>
              <div className=" flex flex-col gap-4  p-4 bg-mantle">
                <p className="text-xl font-medium">Members in our Discord Server</p>
                {membersCount !== null ? (
                  <p className="text-3xl text-subtext0">
                    {membersCount} <span className="text-lg">+</span>
                  </p>
                ) : (
                  <p className="text-xl  text-subtext0">Loading...</p>
                )}
              </div>
            </div>

          </div>
        </Container>

      </div>
      <div className="flex justify-center w-full bg-mantle p-4" >
        <Container className="flex flex-col md:flex-row  gap-8 p-0 ">
          <div className="flex flex-col gap-4 md:w-1/2 ml-4">
            <p className="text-3xl text-subtext0 font-medium text-center  mt-4">VISION</p>
            <p className="mt-8">To build a community that serves as a hub for young programmers to learn, develop and enrich their coding skills and also acts as a platform through which they can exhibit their skills to the technical world as talented programmers..</p>
          </div>
          <div className="flex flex-col gap-4 md:w-1/2 ml-4 mb-4 ">
            <p className="text-3xl font-medium text-center mt-4 text-subtext0">MISSION</p>
            <div className="flex flex-col gap-16 md:gap-8 mt- ">
              <div className="flex ">
                <FontAwesomeIcon icon={faCode} className="m-1 text-mauve"></FontAwesomeIcon>
                <p className="pl-4">To elevate the programming skills of future engineers which will help them learn new tactics to deal with dynamic technologies.</p>
              </div>
              <div className="flex">
                <FontAwesomeIcon icon={faCode} className="m-1 text-mauve"></FontAwesomeIcon>
                <p className="pl-4 ">To enrich the competitive programming skills of students by participating in renowned competitions.</p>
              </div>
              <div className="flex ">
                <FontAwesomeIcon icon={faCode} className="m-1 text-mauve"></FontAwesomeIcon>
                <p className="pl-4">To enrich the competitive programming skills of students by participating in renowned competitions.</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Container className="p-0">
        <div className="flex flex-col gap-4 my-12 px-4">
          <p className="text-4xl">Dive into the Blogosphere</p>
          <p className="text-subtext0 max-w-[500px]">Embark on a read adventure journey of knowledge with our blog series.
          </p>
          <p> Find our dedicated blog site <a className="text-blue no-underline" href="https://blogs.codingclubgct.in">here <FontAwesomeIcon icon={faArrowRight} /></a> </p>
        </div>
        <Blog />
        <Services />
      </Container>
    </div>
  </div>
}
