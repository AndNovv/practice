import React, { useEffect, useRef, useState } from 'react'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { api } from "~/utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faStar } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

type Treatment = {
    name: string,
    selected: boolean
}

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
    let AllTreatments: { name: string }[] = []
    let SanatoriumData: Sanatorium = { name: "", location: "", price: 0, description: "", treatmentProfiles: [] }

    const { data: CategoryResponse } = api.category.getAll.useQuery({ id: currentSanatoriumId });
    const { data: TreatmentResponse } = api.treatment.getAll.useQuery();
    const { data: SanatoriumResponse } = api.sanatorium.getById.useQuery({ id: currentSanatoriumId });

    if (CategoryResponse) {
        AllCategories = CategoryResponse;
    }

    if (TreatmentResponse) {
        AllTreatments = TreatmentResponse;
    }
    if (SanatoriumResponse) {
        SanatoriumData = SanatoriumResponse;
    }

    const [treatmentProfiles, setTreatmentProfiles] = useState([] as Treatment[]);

    useEffect(() => {
        if (AllTreatments) {
            setTreatmentProfiles(AllTreatments.map((treatment) => ({ name: treatment.name, selected: false })));
        }
    }, [AllTreatments])

    const [categoryPanelVisible, setCategoryPanelVisible] = useState(false);

    const [categoryStyle, setCategoryStyle] = useState(-1);

    const [treatmentEditPanelVisible, setTreatmentEditPanelVisible] = useState(false);


    const name = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLTextAreaElement>(null);
    const location = useRef<HTMLInputElement>(null);
    const price = useRef<HTMLInputElement>(null);

    // Handling Categeries

    const handleAddCategoryClick = () => {
        setCategoryPanelVisible(true);
    }

    const handleCategoryClick = (id: number) => {
        setCategoryStyle(id);
        setCategoryPanelVisible(false);
    }

    const trpcUtils = api.useContext();

    // Update Sanatorium

    const { mutate: updateSanatorium } = api.sanatorium.update.useMutation({
        onSuccess: async () => {
            await trpcUtils.sanatorium.getById.invalidate({ id: currentSanatoriumId });
        },
    });

    const handleSaveClick = () => {
        if (name.current && description.current && location.current && price.current) {
            updateSanatorium(
                {
                    id: currentSanatoriumId,
                    name: name.current.value,
                    description: description.current.value,
                    location: location.current.value,
                    price: parseInt(price.current.value),
                });
        }
    }

    // Handling Treatment Profiles

    const updateSanatoriumTreatments = api.sanatorium.updateTreatments.useMutation({
        onSettled: async (input) => {
            console.log(input);
            await trpcUtils.sanatorium.getById.invalidate({ id: currentSanatoriumId });
        },
    });

    const handleSaveTreatments = () => {
        const result = treatmentProfiles.filter((profile) => profile.selected).map((item) => item.name)
        updateSanatoriumTreatments.mutate({
            id: currentSanatoriumId,
            treatmentProfiles: result,
        })
        setTreatmentProfiles(AllTreatments.map((treatment) => ({ name: treatment.name, selected: false })));
        setTreatmentEditPanelVisible(false);
    }

    const handleSelectProfileClick = (name: string) => {
        const updatedTreatmentProfiles: Treatment[] = treatmentProfiles.map((profile) =>
            profile.name === name ? { name: profile.name, selected: !profile.selected } : { name: profile.name, selected: profile.selected })
        setTreatmentProfiles(updatedTreatmentProfiles);
    }

    const handleEditProfileClick = () => {
        setTreatmentEditPanelVisible(true);
    }

    // Creating new category

    const newCategoryTitle = useRef<HTMLInputElement>(null);
    const newCategoryContent = useRef<HTMLTextAreaElement>(null);

    const { mutate: createCategory } = api.category.create.useMutation({
        onSuccess: async () => {
            await trpcUtils.category.getAll.invalidate({ id: currentSanatoriumId })
        }
    });

    const handleSaveCategoryClick = () => {
        if (newCategoryTitle.current && newCategoryContent.current) {
            createCategory({
                title: newCategoryTitle.current.value,
                content: newCategoryContent.current.value,
                style: categoryStyle,
                sanatoriumId: currentSanatoriumId,
                order: AllCategories.length,
            })
            setCategoryStyle(-1);
            setCategoryPanelVisible(false);
        }
    }

    return (
        <div className='flex flex-col min-h-screen'>

            <Header />
            <div className='flex-1 xl:px-40 lg:px-20 px-5 w-full mt-5 flex flex-col'>

                <div className='flex gap-5'>
                    <div className="relative w-full max-h-[30rem] overflow-hidden group rounded-3xl">
                        <div className="absolute h-full w-full cursor-pointer bg-gradient-to-b from-[#00000000] to-[#000000c7] group-hover:to-[#00000096] transition-all"></div>
                        <img className="object-cover transition-all h-full w-full" src="/assets/1.webp" alt="Sanatorium" />
                        <input ref={name} className="absolute text-white text-xl bottom-3 px-5 lg:text-3xl lg:bottom-8 lg:px-10 opacity-50 group-hover:opacity-100 transition-all bg-transparent border-0 outline-none" placeholder='Название' defaultValue={SanatoriumData.name} />
                        <div className="absolute text-white text-xl bottom-3 px-5 right-0 lg:text-3xl lg:bottom-8 lg:px-10 lg:right-0 opacity-50 group-hover:opacity-100 transition-all flex gap-2 items-center">
                            <p>0</p>
                            <FontAwesomeIcon icon={faStar} style={{ color: "#d4f005", }} className='w-8 h-8' />
                        </div>
                    </div>
                    <div className='flex flex-col w-[45%] text-lg py-4 justify-between'>
                        <textarea ref={description} placeholder='Описание' className='outline-none whitespace-pre-wrap' defaultValue={SanatoriumData.description} />
                        <div>
                            <p className='my-2'>Наши профили</p>
                            <div className='flex flex-wrap gap-2 text-sm'>
                                {SanatoriumData.treatmentProfiles.map((treatment, index) => {
                                    return <div key={`profile${index}`} className="bg-slate-50 text-purple-500 py-1 px-2 rounded-full shadow-md w-fit cursor-pointer transition-all">{treatment.name}</div>
                                })}
                                {!treatmentEditPanelVisible &&
                                    <div onClick={() => handleEditProfileClick()} className={"bg-yellow-300 text-white py-1 px-2 rounded-full shadow-md w-fit cursor-pointer transition-all hover:bg-yellow-400"}>Изменить</div>
                                }
                                {treatmentEditPanelVisible && <>
                                    <div className='flex flex-col gap-2 bg-slate-100 p-2 rounded-md my-1'>
                                        <div className='flex flex-wrap gap-2'>
                                            <p className='text-lg'>Выберите необходимые профили:</p>
                                            {treatmentProfiles.map((treatment, index) => <div onClick={() => handleSelectProfileClick(treatment.name)} key={`treatment${index}`} className={treatment.selected ? "bg-purple-500 text-white py-1 px-2 rounded-full shadow-md w-fit cursor-pointer transition-all" : "bg-slate-50 text-purple-500 py-1 px-2 rounded-full shadow-md w-fit cursor-pointer transition-all"}>{treatment.name}</div>)}
                                        </div>
                                        <button onClick={() => handleSaveTreatments()} className='bg-green-400 text-white py-1 px-2 rounded-full shadow-md w-fit cursor-pointer transition-all hover:bg-green-500'>Сохранить</button>
                                    </div>
                                </>
                                }
                            </div>
                        </div>
                        <input ref={location} placeholder='Адрес' className='outline-none text-slate-400 text-md my-3' defaultValue={SanatoriumData.location} />
                        <div className='flex gap-2 items-center bg-purple-500 rounded-lg text-white w-fit px-4 py-4 shadow-xl self-center cursor-pointer'>
                            <p>От</p>
                            <input type="number" ref={price} placeholder='Цена' className='outline-none bg-transparent placeholder-white w-16' defaultValue={SanatoriumData.price} />
                            <p className=''>₽/сутки</p>
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


                {categoryPanelVisible &&
                    <div className='relative'>
                        <p className='font-semibold text-lg mt-4'>Выберите стилизацию нового раздела:</p>
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

                            <div onClick={() => handleCategoryClick(0)} className='flex flex-col gap-4 border-purple-600 bg-slate-50 border p-5 rounded-xl hover:bg-slate-100 hover:scale-105 transition-all cursor-pointer'>
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

                            <div onClick={() => handleCategoryClick(0)} className='flex flex-col gap-4 border-purple-600 bg-slate-50 border p-5 rounded-xl hover:bg-slate-100 hover:scale-105 transition-all cursor-pointer'>
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

                {categoryStyle === 0 &&
                    <div className='flex flex-col gap-4 items-center transition-all mt-5 border rounded-xl py-3 px-4'>
                        <input ref={newCategoryTitle} className='bg-slate-900 bg-transparent text-center font-bold text-2xl w-full outline-none' placeholder='Заголовок раздела' />
                        <textarea ref={newCategoryContent} className='bg-slate-400 bg-transparent text-center w-full h-fit overflow-y-hidden overscroll-y-contain text-lg outline-none' placeholder='Содержимое раздела' />
                        <div onClick={() => handleSaveCategoryClick()} className='bg-green-400 text-white rounded-xl px-4 py-2 cursor-pointer w-fit mt-5 shadow-lg hover:bg-green-500 transition-all'>
                            <p className='font-semibold text-xl'>Сохранить раздел</p>
                        </div>
                    </div>
                }

                {categoryStyle === 1 &&
                    <div className='flex flex-col gap-4 items-center transition-all mt-5 border rounded-xl py-3 px-4'>
                        <input ref={newCategoryTitle} className='bg-slate-900 bg-transparent font-bold text-2xl w-full outline-none' placeholder='Заголовок раздела' />
                        <textarea ref={newCategoryContent} className='bg-slate-400 bg-transparent w-full h-fit overflow-y-hidden overscroll-y-contain text-lg outline-none' placeholder='Содержимое раздела' />
                        <div onClick={() => handleSaveCategoryClick()} className='bg-green-400 text-white rounded-xl px-4 py-2 cursor-pointer w-fit mt-5 shadow-lg hover:bg-green-500 transition-all'>
                            <p className='font-semibold text-xl'>Сохранить раздел</p>
                        </div>
                    </div>
                }

                {currentSanatoriumId && !categoryPanelVisible && categoryStyle < 0 &&
                    <div onClick={() => handleAddCategoryClick()} className='bg-slate-100 rounded-xl px-4 py-2 flex gap-2 items-center cursor-pointer w-fit mt-5 shadow-lg hover:bg-slate-200 transition-all'>
                        <FontAwesomeIcon icon={faPlus} style={{ color: "#9a4bbe", }} className='w-6 h-6' />
                        <p className='font-semibold text-xl'>Добавить новый раздел</p>
                    </div>
                }

                <div onClick={() => handleSaveClick()} className='bg-green-400 text-white rounded-xl px-4 py-2 cursor-pointer w-fit mt-5 shadow-lg hover:bg-green-500 transition-all'>
                    <p className='font-semibold text-xl'>{currentSanatoriumId ? "Изменить" : "Сохранить"}</p>
                </div>

            </div>
            <Footer />

        </div >
    )
}

export default Edit
