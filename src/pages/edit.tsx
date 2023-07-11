import React, { useRef, useState } from 'react'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { api } from "~/utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faStar } from '@fortawesome/free-solid-svg-icons'

const Edit = () => {

    type Treatment = {
        name: string,
        selected: boolean
    }

    const [categoryPanelVisible, setCategoryPanelVisible] = useState(false);

    const [categoryStyle, setCategoryStyle] = useState(0);

    const [sanatoriumData, setSanatoriumData] = useState({});

    const name = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLTextAreaElement>(null);
    const location = useRef<HTMLInputElement>(null);
    const price = useRef<HTMLInputElement>(null);

    const getTreatments = api.treatment.getAll.useQuery();

    const [request, setRequest] = useState(true);
    const [treatmentProfiles, setTreatmentProfiles] = useState([] as Treatment[]);

    if (request) {
        const treatmentData = getTreatments.data;
        if (treatmentData) {
            const treatmentProfile: Treatment[] = treatmentData.map((treatmentprofile) => ({ name: treatmentprofile.name, selected: false }));
            setTreatmentProfiles(treatmentProfile);
            setRequest(false);
        }
    }

    const handleAddCategoryClick = () => {
        setCategoryPanelVisible(true);
    }

    const handleCategoryClick = (id: number) => {
        setCategoryStyle(id);
        setCategoryPanelVisible(false);
    }

    const handleSaveButton = () => {
        setSanatoriumData({
            name: name,
            description: description,
            location: location,
            price: price,
        })
    }

    const handleSelectProfileClick = (name: string) => {
        const updatedTreatmentProfiles: Treatment[] = treatmentProfiles.map((profile, index) =>
            profile.name === name ? { name: profile.name, selected: !profile.selected } : { name: profile.name, selected: profile.selected })
        setTreatmentProfiles(updatedTreatmentProfiles);
    }

    return (
        <div className='flex flex-col min-h-screen'>

            <Header />
            <div className='flex-1 xl:px-40 lg:px-20 px-5 w-full mt-5'>

                <div className='flex gap-5'>
                    <div className="relative w-full max-h-[30rem] overflow-hidden group rounded-3xl">
                        <div className="absolute h-full w-full cursor-pointer bg-gradient-to-b from-[#00000000] to-[#000000c7] group-hover:to-[#00000096] transition-all"></div>
                        <img className="object-cover transition-all h-full w-full" src="/assets/1.webp" alt="Sanatorium" />
                        <input ref={name} className="absolute text-white text-xl bottom-3 px-5 lg:text-3xl lg:bottom-8 lg:px-10 opacity-50 group-hover:opacity-100 transition-all bg-transparent border-0 outline-none" placeholder='Название' />
                        <div className="absolute text-white text-xl bottom-3 px-5 right-0 lg:text-3xl lg:bottom-8 lg:px-10 lg:right-0 opacity-50 group-hover:opacity-100 transition-all flex gap-2 items-center">
                            <p>0</p>
                            <FontAwesomeIcon icon={faStar} style={{ color: "#d4f005", }} />
                        </div>
                    </div>
                    <div className='flex flex-col w-1/3 text-lg py-4'>
                        <textarea ref={description} placeholder='Описание' className='outline-none whitespace-pre-wrap flex-1 resize-none' />
                        <p className='my-2'>Наши профили</p>
                        <div className='flex flex-wrap gap-2'>
                            {treatmentProfiles.map((treatment, index) => {
                                return <div onClick={() => { handleSelectProfileClick(treatment.name) }} key={`profile${index}`} className={treatment.selected ? "bg-purple-500 text-white py-1 px-2 rounded-full shadow-md text-md w-fit cursor-pointer transition-all" : "bg-slate-50 text-purple-500 py-1 px-2 rounded-full shadow-md text-md w-fit cursor-pointer transition-all"}>{treatment.name}</div>
                            })}
                        </div>
                        <input ref={location} placeholder='Адрес' className='outline-none text-slate-400 text-md my-3' />
                        <div className='flex gap-2 items-center bg-purple-500 rounded-lg text-white w-fit px-4 py-2 shadow-xl self-center cursor-pointer'>
                            <p>От</p>
                            <input ref={price} placeholder='Цена' className='outline-none bg-transparent placeholder-white w-12' />
                            <p className=''>₽/сутки</p>
                        </div>
                    </div>
                </div>

                {categoryPanelVisible &&
                    <div className='relative'>
                        <p className='font-semibold text-lg mt-4'>Выберите стилизацию раздела:</p>
                        <div className='w-full grid grid-cols-2 md:grid-cols-4 mt-4 gap-4 items-start'>
                            <div onClick={() => handleCategoryClick(0)} className='flex flex-col gap-4 flex-1 border-purple-600 bg-slate-50 border p-5 rounded-xl items-center hover:bg-slate-100 hover:scale-105 transition-all cursor-pointer'>
                                <div className='bg-slate-900 h-[2px] w-2/5 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-4/5 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-2/3 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-full rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-4/5 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-full rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-2/3 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-3/5 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-full rounded-full'></div>
                            </div>

                            <div onClick={() => handleCategoryClick(1)} className='flex flex-col gap-4 border-purple-600 bg-slate-50 border p-5 rounded-xl hover:bg-slate-100 hover:scale-105 transition-all cursor-pointer'>
                                <div className='bg-slate-900 h-[2px] w-2/5 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-4/5 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-4/5 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-2/3 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-full rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-2/3 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-full rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-3/5 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-full rounded-full'></div>
                            </div>

                            <div onClick={() => handleCategoryClick(2)} className='flex flex-col gap-4 border-purple-600 bg-slate-50 border p-5 rounded-xl hover:bg-slate-100 hover:scale-105 transition-all cursor-pointer'>
                                <div className='bg-slate-900 h-[2px] w-2/5 rounded-full'></div>
                                <div className='flex gap-2'>
                                    <div className='h-10 sm:h-12 md:h-8 lg:h-10 xl:h-12 flex-1 bg-purple-400 rounded-md'></div>
                                    <div className='h-10 sm:h-12 md:h-8 lg:h-10 xl:h-12 flex-1 bg-purple-400 rounded-md'></div>
                                    <div className='h-10 sm:h-12 md:h-8 lg:h-10 xl:h-12 flex-1 bg-purple-400 rounded-md'></div>
                                </div>

                                <div className='bg-slate-400 h-[2px] w-4/5 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-2/3 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-full rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-3/5 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-full rounded-full'></div>
                            </div>

                            <div onClick={() => handleCategoryClick(3)} className='flex flex-col gap-4 border-purple-600 bg-slate-50 border p-5 rounded-xl hover:bg-slate-100 hover:scale-105 transition-all cursor-pointer'>
                                <div className='flex gap-2'>
                                    <div className='h-12 sm:h-16 md:h-18 xl:h-18 flex-1 bg-purple-400 rounded-md'></div>
                                    <div className='flex-1 bg-slate-900 h-[2px] w-2/5 rounded-full mt-2'></div>
                                </div>
                                <div className='bg-slate-400 h-[2px] w-4/5 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-2/3 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-full rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-3/5 rounded-full'></div>
                                <div className='bg-slate-400 h-[2px] w-full rounded-full'></div>
                            </div>

                        </div>


                    </div>
                }

                {!categoryPanelVisible &&
                    <div onClick={() => handleAddCategoryClick()} className='bg-slate-100 rounded-xl px-4 py-2 flex gap-2 items-center cursor-pointer w-fit mt-5 shadow-lg hover:bg-slate-200 transition-all'>
                        <FontAwesomeIcon icon={faPlus} style={{ color: "#9a4bbe", }} className='w-6 h-6' />
                        <p className='font-semibold text-xl'>Добавить новый раздел</p>
                    </div>
                }

            </div>
            <Footer />

        </div>
    )
}

export default Edit
