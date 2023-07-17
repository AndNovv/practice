import React, { useRef, useState } from 'react'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { api } from "~/utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import Head from 'next/head';

const Edit = () => {

    type Treatment = {
        name: string,
        selected: boolean,
    }

    const name = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLTextAreaElement>(null);
    const location = useRef<HTMLInputElement>(null);
    const price = useRef<HTMLInputElement>(null);

    const [treatmentProfiles, setTreatmentProfiles] = useState([] as Treatment[]);

    const { data: TreatmentResponse } = api.treatment.getAll.useQuery();

    let AllTreatments: { name: string }[] = []

    if (TreatmentResponse) {
        AllTreatments = TreatmentResponse;
    }

    React.useEffect(() => {
        if (AllTreatments) {
            setTreatmentProfiles(AllTreatments.map((treatment) => ({ name: treatment.name, selected: false })));
        }
    }, [AllTreatments])

    // Creating new Sanatorium

    const { mutate: createSanatorium } = api.sanatorium.create.useMutation({
        onSuccess: (data) => {
            window.location.href = `edit/${data.id}`
        }
    });

    const handleSaveClick = () => {
        const SelectedProfilesNames = treatmentProfiles.filter((profile) => profile.selected).map((item) => item.name)
        if (name.current && description.current && location.current && price.current) {
            createSanatorium(
                {
                    name: name.current.value,
                    description: description.current.value,
                    location: location.current.value,
                    price: parseInt(price.current.value),
                    treatmentProfiles: SelectedProfilesNames
                });
        }

    }

    const handleSelectProfileClick = (name: string) => {
        const updatedTreatmentProfiles: Treatment[] = treatmentProfiles.map((profile) =>
            profile.name === name ? { name: profile.name, selected: !profile.selected } : { name: profile.name, selected: profile.selected })
        setTreatmentProfiles(updatedTreatmentProfiles);
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

                    <div className='flex gap-5 lg:flex-row flex-col'>
                        <div className="relative w-full max-h-[30rem] overflow-hidden group rounded-3xl">
                            <div className="absolute h-full w-full cursor-pointer bg-gradient-to-b from-[#00000000] to-[#000000c7] group-hover:to-[#00000096] transition-all"></div>
                            <img className="object-cover transition-all h-full w-full" src="/assets/1.webp" alt="Sanatorium" />
                            <div className='absolute w-full text-white text-2xl lg:text-3xl bottom-5 lg:bottom-8 px-8 lg:px-10 flex justify-between opacity-50 group-hover:opacity-100 transition-all'>
                                <input ref={name} className="flex-1 bg-transparent border-0 outline-none" placeholder='Название' />
                                <div className="flex gap-2 items-center">
                                    <p>0</p>
                                    <FontAwesomeIcon icon={faStar} style={{ color: "#d4f005", }} className='w-8 h-8' />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col lg:w-[45%] w-full text-lg py-4 justify-between'>
                            <textarea ref={description} placeholder='Описание' className='outline-none whitespace-pre-wrap' />
                            <div>
                                <p className='my-2'>Наши профили</p>
                                <div className='flex flex-wrap gap-2 text-sm'>
                                    {treatmentProfiles.map((treatment, index) => {
                                        return <div onClick={() => { handleSelectProfileClick(treatment.name) }} key={`profile${index}`} className={treatment.selected ? "bg-purple-500 text-white py-1 px-2 rounded-full shadow-md w-fit cursor-pointer transition-all" : "bg-slate-50 text-purple-500 py-1 px-2 rounded-full shadow-md w-fit cursor-pointer transition-all"}>{treatment.name}</div>
                                    })}
                                </div>
                            </div>
                            <input ref={location} placeholder='Адрес' className='outline-none text-slate-400 text-md my-3' />
                            <div className='flex gap-2 items-center bg-purple-500 rounded-lg text-white w-fit px-4 py-4 shadow-xl self-center cursor-pointer'>
                                <p>От</p>
                                <input type="number" ref={price} placeholder='Цена' className='outline-none bg-transparent placeholder-white w-16' />
                                <p className=''>₽/сутки</p>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-center w-full'>
                        <div onClick={() => handleSaveClick()} className='bg-green-400 text-white rounded-xl px-4 py-2 cursor-pointer w-fit mt-5 shadow-lg hover:bg-green-500 transition-all font-semibold text-xl'>
                            <p className=''>Сохранить</p>
                        </div>
                    </div>

                </div>
                <Footer />

            </div >
        </>
    )
}

export default Edit
