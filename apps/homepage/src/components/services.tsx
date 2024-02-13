
"use client"
import fullstack from '@/assets/fullstack.svg'
import app from '@/assets/app.svg'
import network from '@/assets/network.svg'
import ai from '@/assets/ai.svg'
import software from '@/assets/software.svg'
import devops from '@/assets/devops.svg'
import { useState, useEffect, useRef } from 'react'
import classnames from 'classnames'
import Image from 'next/image';
import { useMediaQuery } from '@mui/material'

const service = [
    {
        name: 'FullStack Development ',
        photo: fullstack
    },
    {
        name: 'App Development ',
        photo: app
    },
    {
        name: 'AI Engineering ',
        photo: ai
    },
    {
        name: 'Software Development ',
        photo: software
    },
    {
        name: 'Network Engineering ',
        photo: network
    },
    {
        name: 'Devops ',
        photo: devops
    }


]

export default function Services() {
    const [activeItem, setActiveItem] = useState(3);
    const wrapperRef = useRef<HTMLUListElement | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMobile = useMediaQuery("(max-width:640px)")
    useEffect(() => {
        if (!wrapperRef.current) return;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        wrapperRef.current.style.setProperty(
            "--transition",
            "600ms cubic-bezier(0.22, 0.61, 0.36, 1)"
        );
        timeoutRef.current = setTimeout(() => {
            wrapperRef.current?.style.removeProperty("--transition");
        }, 900);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [activeItem]);

    return (
        <div className="">
            <div className='my-12 flex flex-col px-4 gap-4'>
                <p className='text-4xl'>Tech services Hub</p>
                <p className='text-subtext0'> Our Software Development Team specializes in various niches mainly: </p>
            </div>
            <div className="w-full">
                <ul
                    ref={wrapperRef}
                    className="px-4 group flex flex-col gap-4 h-[500px] md:h-[300px] md:flex-row md:gap-[1.5%] w-full md:w-auto"
                >
                    {service.map((item, i) => (
                        <li
                            onClick={() => setActiveItem(i)}
                            aria-current={activeItem === i}
                            className={classnames(
                                "relative cursor-pointer md:h-full h-[10%] md:w-[10%] first:h-[5%] md:first:h-full md:last:h-full last:h-[5%] md:first:w-[5%] md:last:w-[5%] md:[&[aria-current='true']]:w-[60%] [&[aria-current='true']]:h-[60%] md:[&[aria-current='true']]:h-full",
                                "md:[transition:width_var(--transition,200ms_ease-in)]",
                                "md:before-block before:absolute before:bottom-0 before:left-[-10px] before:right-[-10px] before:top-0 before:hidden",
                                "md:[&:not(:hover),&:not(:first),&:not(:last)]:group-hover:w-[7%] md:hover:w-[12%] list-none", {"transition-[height]": isMobile}
                            )}
                            key={i}
                        >
                            <div className="relative h-full w-full overflow-hidden rounded bg-mantle ">
                                <Image
                                    className={classnames("absolute right-0 top-1/2 h-auto w-full md:max-w-none -translate-y-1/2 object-contain md:left-1/2 md:h-[640px] md:w-[590px] md:-translate-x-1/2")}
                                    src={item.photo}
                                    alt='item.name'
                                />
                                <div
                                    className={classnames(
                                        "via-transparent left-0 top-0 bottom-0 right-0 transition-[transform,opacity] absolute bg-gradient-to-t from-mantle to-transparent z-10 flex items-end p-4", { "before:content-[''] before:top-0 before:left-0 before:right-0 before:bottom-0 before:absolute before:bg-base before:bg-opacity-80": activeItem !== i }
                                    )}
                                >
                                    <p className="text-lg font-bold md:text-2xl" style={{ opacity: activeItem === i ? "100%" : "0%" }}>{item.name}</p>

                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


