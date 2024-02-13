"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faH, faHome, faBlog, faPeopleGroup, faPhone, faUserPlus, faPersonChalkboard, IconDefinition, faGlobe, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faDiscord, faInstagram, faGithub, faYoutube, faLinkedin, faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import { Container, Dialog, Divider } from '@mui/material';
import dark from "@/assets/dark.png"
import light from "@/assets/light.png"
import { DarkModeContext } from "@/context/darkmode"
import { useContext, useState } from 'react';
import ProfileCard from './profile';

import pavithra from '@/assets/team/pavithra.webp'
import joel from '@/assets/team/joel.webp'
import noufal from '@/assets/team/noufal.webp'

const footerItems = {
    title: 'Quick links', items: [
        { label: 'Home', href: '/', icon: faHome },
        { label: 'Activities', href: '/activities', icon: faPersonChalkboard },
        { label: 'Teams', href: '/about', icon: faPeopleGroup },
        { label: 'Blogs', href: 'https://blogs.codingclubgct.in', icon: faBlog },
        { label: 'Contact', href: '/contact', icon: faPhone },
        { label: 'Join Us', href: '/join', icon: faUserPlus }
    ]
}

const footerElements = {
    title: 'Social Media', items: [
        { label: 'Mail', href: 'mailto:codingclub@gct.ac.in', icon: faEnvelope },
        { label: 'Instagram', href: 'https://www.instagram.com/codingclub.gct', icon: faInstagram },
        { label: 'YouTube', href: 'https://www.youtube.com/channel/UCeq-w-ypo1_hoyT9OuIjB6g', icon: faYoutube },
        { label: 'WhatsApp', href: 'https://api.whatsapp.com/send?phone=919655775678', icon: faWhatsapp },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/coding-club-gct/', icon: faLinkedin },
        { label: 'Discord', href: 'https://discord.gg/fMqUwkjQqB', icon: faDiscord }
    ]
}

type CardItem = { photo: string, name: string, designation: string, about: string, socials: { icon: IconDefinition, href: string }[], domains: string[], rollNo: string }

const teamMembers : CardItem[] = [
    {
        photo: pavithra.src, name: 'Pavithra V', designation: 'Executive Member', about: 'Lorem ipsum dolor sit amet.', socials: [
            { icon: faGithub, href: 'https://github.com/Pavi143' },
            { icon: faLinkedin, href: 'https://www.linkedin.com/in/pavithra-v-323195217' },
            { icon: faInstagram, href: 'https://www.instagram.com/pavi_vs_010403' }

        ], domains: ['Full Stack', 'Software Engineering'], rollNo: '2018131'
    },
    {
        photo: joel.src, name: 'Joel Samuel Raj A', designation: 'Secretary', about: 'Lorem ipsum dolor sit amet.', socials: [
            { icon: faGithub, href: 'https://github.com/useEffects' },
            { icon: faLinkedin, href: 'https://www.linkedin.com/in/joel-samuel-369355206' },
            { icon: faInstagram, href: 'https://www.instagram.com/_joel.24samuel' }

        ], domains: ['fullStack', 'Software Engineering'], rollNo: '2018119'
    },
    {
        photo: noufal.src, name: 'Noufal Rahman', designation: 'Web Development Lead', about: 'Lorem ipsum dolor sit amet.', socials: [
            { icon: faGithub, href: 'https://github.com/iamnoufal' },
            { icon: faLinkedin, href: 'https://linkedIn.com/in/iamnoufal' },
            { icon: faInstagram, href: 'https://instagram.com/_iam_noufal' },
            { icon: faGlobe, href: "https://noufal.dev" }

        ], domains: ['Developer', 'Engineer'], rollNo: '2017313'
    },
]

export default function Footer() {
    const { darkMode } = useContext(DarkModeContext)
    const [teamDialogOpen, setTeamDialogOpen] = useState<boolean>(false)

    return <div className=' bg-mantle w-full '>
        <Divider />
        <div className='flex flex-col md:flex-row justify-between p-4 text-sm gap-4'>
            <div className='my-4 flex flex-col gap-2 md:items-center md:w-1/5'>
                <div className='flex flex-col gap-2'>
                    <p className='text-yellow'>Coding Club GCT</p>
                    <p> Not a <span className='text-yellow'> Rocket </span> Science </p>
                </div>
                <img src={darkMode ? dark.src : light.src} className="w-20 h-20"></img>
            </div>
            <div className=' flex md:justify-center md:w-1/5'>
                <div>
                    <p className='my-4 font-bold'> {footerItems.title}</p>
                    <div className='flex flex-col gap-2'>

                        {footerItems.items.map(({ label, href, icon }, j) => <div key={j} className='flex justify-between w-28 mr-10 text-sm text-subtext0 ' >
                            <Link href={href} className=' flex justify-between text-sm text-subtext0 no-underline w-28 items-center'>
                                <span>{label}</span>
                                <FontAwesomeIcon icon={icon} className='w-4 text-subtext0 '></FontAwesomeIcon>
                            </Link>
                        </div>)}
                    </div>
                </div>
            </div>

            <div className='flex md:justify-center md:w-1/5 '>
                <div>
                    <p className='my-4  font-bold'>Domains</p>
                    <div className='flex flex-col gap-2 text-sm text-subtext0'>
                        <p>Fullstack Development</p>
                        <p>App Development</p>
                        <p>Ai Engineering</p>
                        <p>Software Development</p>
                        <p>Network Engineering</p>
                    </div>
                </div>
            </div>

            <div className='flex md:justify-center  md:w-1/5 '>
                <div className='flex flex-col'>
                    <p className='my-4 font-bold'>Community</p>
                    <div className='flex justify-between w-28 mr-10 mb-2 text-sm text-subtext0'>
                        <Link href='https://github.com/coding-club-gct' className=' flex justify-between text-subtext0 no-underline w-28 items-center'>
                            <span>Github</span>
                            <FontAwesomeIcon icon={faGithub} className='w-4 '></FontAwesomeIcon>
                        </Link>
                    </div>
                    <div className='flex justify-between w-28 mr-10 mb-2 text-sm text-subtext0'>
                        <Link href='https://t.me/+ztnWAjnsY9FiZjk1' className=' flex justify-between text-subtext0 no-underline w-28 items-center'>
                            <span>Telegram</span>
                            <FontAwesomeIcon icon={faTelegram} className='w-4 '></FontAwesomeIcon>
                        </Link>
                    </div>
                </div>
            </div>

            <div className=' flex md:justify-center md:w-1/5'>
                <div className='flex flex-col'>
                    <p className='my-4 font-bold'> {footerElements.title}</p>
                    <div className='flex text-sm text-subtext0'>
                        {footerElements.items.map(({ label, href, icon }, j) => <div key={j} className=' flex justify-center' >
                            <Link href={href} className='text-subtext0 no-underline p-1 '>{<FontAwesomeIcon icon={icon} className='w-4 text-subtext0'></FontAwesomeIcon>}</Link>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
        <Divider></Divider>
        <Dialog maxWidth="lg" open={teamDialogOpen} onClose={() => setTeamDialogOpen(false)}>
            <div >
                <Container className="flex flex-col gap-4 py-5">
                    <div className="flex flex-col gap-4">
                        <p className="text-4xl font-medium text-center my-2" >Web Team </p>
                    </div>
                    <div className="md:grid grid-rows-1 grid-cols-3 w-full gap-4">
                        {teamMembers.map((item, i) => <div key={i} className="w-full my-4 md:my-0 ">
                            <ProfileCard {...item} />
                        </div>)}
                    </div>
                </Container>
            </div>
        </Dialog>
        <p className='text-center text-sm p-4'>Made with ❤️ by <span onClick={() => setTeamDialogOpen(true)} className='text-blue no-underline cursor-pointer'>the people of Coding Club </span></p>
    </div >



}