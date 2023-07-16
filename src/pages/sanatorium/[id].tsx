import React from 'react'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { api } from "~/utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import Head from 'next/head';

type Category = {
    title: string,
    content: string,
    style: number,
}

type Sanatorium = {
    name: string,
    price: number,
    location: string,
    description: string,
    treatmentProfiles: { id: string, name: string }[],
}


const Edit = () => {

    const router = useRouter();

    let currentSanatoriumId = ""
    if (typeof router.query.id === "string") {
        currentSanatoriumId = router.query.id;
    }

    let AllCategories: Category[] = []
    let SanatoriumData: Sanatorium = { name: "", location: "", price: 0, description: "", treatmentProfiles: [] }

    const { data: CategoryResponse } = api.category.getAll.useQuery({ id: currentSanatoriumId });
    const { data: SanatoriumResponse } = api.sanatorium.getById.useQuery({ id: currentSanatoriumId });

    if (CategoryResponse) {
        AllCategories = CategoryResponse;
    }
    if (SanatoriumResponse) {
        SanatoriumData = SanatoriumResponse;
    }

    return (
        <>
            <Head>
                <title>Поиск санаториев</title>
                <meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='flex flex-col min-h-screen'>

                <Header />
                <div className='flex-1 xl:px-40 lg:px-20 px-5 w-full mt-5 flex flex-col'>

                    <div className='flex gap-5 md:flex-row flex-col'>
                        <div className="relative w-full max-h-[30rem] overflow-hidden group rounded-3xl">
                            <div className="absolute h-full w-full cursor-pointer bg-gradient-to-b from-[#00000000] to-[#000000c7] group-hover:to-[#00000096] transition-all"></div>
                            <img className="object-cover transition-all h-full w-full" src="/assets/1.webp" alt="Sanatorium" />
                            <div className='absolute text-white text-2xl lg:text-3xl bottom-5 lg:bottom-8 px-8 lg:px-10 flex justify-between w-full opacity-50 group-hover:opacity-100 transition-all'>
                                <div className="flex-1" placeholder='Название'>{SanatoriumData.name}</div>
                                <div className="flex gap-2 items-center">
                                    <p>0</p>
                                    <FontAwesomeIcon icon={faStar} style={{ color: "#d4f005", }} className='w-8 h-8' />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col md:w-[45%] w-full text-lg py-4 justify-between'>
                            <div className='flex-1'>{SanatoriumData.description}</div>
                            <div>
                                <p className='my-2'>Наши профили</p>
                                <div className='flex flex-wrap gap-2 text-sm'>
                                    {SanatoriumData.treatmentProfiles.map((treatment, index) => {
                                        return <div key={`profile${index}`} className="bg-slate-50 text-purple-500 py-1 px-2 rounded-full shadow-md w-fit cursor-pointer transition-all">{treatment.name}</div>
                                    })}
                                </div>
                            </div>
                            <div className='text-slate-400 text-md my-3'>{SanatoriumData.location}</div>
                            <div className='flex gap-2 items-center bg-purple-500 rounded-lg text-white w-fit px-4 py-4 shadow-xl self-center cursor-pointer'>
                                <div className='w-fit'>{`от ${SanatoriumData.price} ₽/сутки`}</div>
                            </div>
                        </div>
                    </div>

                    {AllCategories.map((category, index) => {
                        if (category.style === 0)
                            return <div key={`category${index}`} className='flex flex-col gap-4 items-center transition-all mt-5 border rounded-xl py-3 px-4'>
                                <div className='bg-slate-900 bg-transparent text-center font-bold text-2xl w-full outline-none' placeholder='Заголовок раздела'>{category.title}</div>
                                <div className='bg-slate-400 bg-transparent text-center w-full h-fit overflow-y-hidden overscroll-y-contain text-lg outline-none' placeholder='Содержимое раздела'>{category.content}</div>
                            </div>
                        else if (category.style === 1)
                            return <div key={`category${index}`} className='flex flex-col gap-4 items-center transition-all mt-5 border rounded-xl py-3 px-4'>
                                <div className='bg-slate-900 bg-transparent font-bold text-2xl w-full outline-none' placeholder='Заголовок раздела'>{category.title}</div>
                                <div className='bg-slate-400 bg-transparent w-full h-fit overflow-y-hidden overscroll-y-contain text-lg outline-none' placeholder='Содержимое раздела'>{category.content}</div>
                            </div>
                    }
                    )}

                </div>
                <Footer />

            </div >
        </>
    )
}

export default Edit
