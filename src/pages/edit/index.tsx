import React, { useRef, useState } from 'react'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { api } from "~/utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faStar } from '@fortawesome/free-solid-svg-icons'

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
        const updatedTreatmentProfiles: Treatment[] = treatmentProfiles.map((profile, index) =>
            profile.name === name ? { name: profile.name, selected: !profile.selected } : { name: profile.name, selected: profile.selected })
        setTreatmentProfiles(updatedTreatmentProfiles);
    }

    return (
        <div className='flex flex-col min-h-screen'>

            <Header />
            <div className='flex-1 xl:px-40 lg:px-20 px-5 w-full mt-5 flex flex-col'>

                <div className='flex gap-5'>
                    <div className="relative w-full max-h-[30rem] overflow-hidden group rounded-3xl">
                        <div className="absolute h-full w-full cursor-pointer bg-gradient-to-b from-[#00000000] to-[#000000c7] group-hover:to-[#00000096] transition-all"></div>
                        <img className="object-cover transition-all h-full w-full" src="/assets/1.webp" alt="Sanatorium" />
                        <input ref={name} className="absolute text-white text-xl bottom-3 px-5 lg:text-3xl lg:bottom-8 lg:px-10 opacity-50 group-hover:opacity-100 transition-all bg-transparent border-0 outline-none" placeholder='Название' />
                        <div className="absolute text-white text-xl bottom-3 px-5 right-0 lg:text-3xl lg:bottom-8 lg:px-10 lg:right-0 opacity-50 group-hover:opacity-100 transition-all flex gap-2 items-center">
                            <p>0</p>
                            <FontAwesomeIcon icon={faStar} style={{ color: "#d4f005", }} className='w-8 h-8' />
                        </div>
                    </div>
                    <div className='flex flex-col w-[45%] text-lg py-4 justify-between'>
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

                <div onClick={() => handleSaveClick()} className='bg-green-400 text-white rounded-xl px-4 py-2 cursor-pointer w-fit mt-5 shadow-lg hover:bg-green-500 transition-all'>
                    <p className='font-semibold text-xl'>Сохранить</p>
                </div>

            </div>
            <Footer />

        </div >
    )
}

export default Edit
