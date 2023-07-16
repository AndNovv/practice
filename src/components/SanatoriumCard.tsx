/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import Link from "next/link";

type SanatoriumCardProps = {
    id: string;
    name: string;
    description: string;
    location: string;
    price: number;
    rating: number;
    treatmentProfiles: {
        name: string;
    }[];
}

const images = ["assets/1.webp", "assets/2.webp", "assets/3.webp", "assets/4.webp", "assets/5.jpg"];

const SanatoriumCard = (sanatorium: SanatoriumCardProps) => {
    return (
        <Link href={`/sanatorium/${sanatorium.id}`} className="group relative w-full lg:w-[48%] h-fit text-white text-4xl font-semibold rounded-3xl overflow-hidden shadow-lg">
            <div className="relative w-full h-80 overflow-hidden">
                <div className="absolute h-full w-full cursor-pointer bg-gradient-to-b from-[#00000000] to-[#000000c7] group-hover:to-[#0000007d] transition-all"></div>
                <img className="object-cover h-80 w-full transition-all" src={images[Math.floor(Math.random() * 5)]} alt={`${sanatorium.name} image`} />
                <div className='absolute w-full text-white text-2xl lg:text-3xl bottom-5 lg:bottom-8 px-8 lg:px-10 flex justify-between opacity-50 group-hover:opacity-100 transition-all'>
                    <div className="flex-1 border-0 outline-none">{sanatorium.name}</div>
                    <div className="flex gap-2 items-center">
                        <p>{sanatorium.rating}</p>
                        <FontAwesomeIcon icon={faStar} style={{ color: "#d4f005", }} className='w-8 h-8' />
                    </div>
                </div>
            </div>
            <div className="px-8 py-3 flex flex-col">
                <p className="text-black text-xl font-normal pb-2">{sanatorium.description}</p>
                <div className="flex flex-wrap gap-3 pb-2 flex-col">
                    {/* <p className='text-xl text-black font-normal'>Наши профили</p> */}
                    <div className='flex flex-wrap gap-2 my-4'>
                        {sanatorium.treatmentProfiles?.map((treatment, index) => {
                            return <div key={`profile${index}`} className="bg-slate-50 text-purple-500 py-2 px-4 rounded-full shadow-md text-lg cursor-pointer">{treatment.name}</div>
                        })}
                    </div>
                </div>
                <div className='outline-none text-slate-400 text-xl my-3 self-end'>{sanatorium.location}</div>
                <div className='bg-purple-500 rounded-lg text-white w-fit self-end text-2xl mb-3 px-4 py-4 shadow-xl outline-none placeholder-white'>{`от ${sanatorium.price} ₽/сутки`}</div>
            </div>
        </Link>
    )
}

export default SanatoriumCard