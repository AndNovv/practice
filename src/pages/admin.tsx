import Head from "next/head";
import { useRef, useState } from "react";
import { api } from "~/utils/api";
import Footer from "~/components/Footer";

import React from 'react'
import Header from "~/components/Header";

type SanatoriumType = {
    name: string,
    description: string,
    location: string,
    price: number,
    treatmentProfiles: { name: string }[]
}

const Admin = () => {


    const treatment = useRef<HTMLInputElement>(null);


    const trpcUtils = api.useContext();

    const { data: sanatoriums } = api.sanatorium.getAll.useQuery();

    const { mutate: deleteSanatorium } = api.sanatorium.delete.useMutation({
        onSuccess: async () => {
            await trpcUtils.sanatorium.getAll.invalidate();
        }
    });

    const { data: treatmentProfiles } = api.treatment.getAll.useQuery();

    const { mutate: createTreatment } = api.treatment.create.useMutation({
        onSuccess: async () => {
            await trpcUtils.treatment.getAll.invalidate();
        }
    })

    const { mutate: deleteTreatment } = api.treatment.delete.useMutation({
        onSuccess: async () => {
            await trpcUtils.treatment.getAll.invalidate();
        }
    })



    const handleAddTreatmentClick = () => {
        if (treatment.current) {
            createTreatment({ name: treatment.current.value });
            treatment.current.value = "";
        }
    }

    const handleTreatmentDelete = (treatmentProfile: string) => {
        deleteTreatment({ name: treatmentProfile });
    }

    const handleSanatoriumDelete = (name: string) => {
        deleteSanatorium({ name: name });
    }

    // let treatmentProfile: string[] = [];

    // ["Лор органы", "Гастроэнтерология", "Желчевыделительная система", "Мочеполовая система", "Гинекология", "Имунная система", "Нарушение обмена веществ"]

    return (

        <>
            <Head>
                <title>Поиск санаториев</title>
                <meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="bg-slate-100 min-h-screen w-full flex flex-col">

                <Header />

                <div className="xl:px-40 lg:px-20 px-5 flex-1">

                    <div>
                        <p className="text-2xl text-black font-semibold pt-4">Список всех текущих профилей лечения:</p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            {treatmentProfiles && treatmentProfiles.map((treatmentProfile, index) => {
                                return <p onClick={() => handleTreatmentDelete(treatmentProfile.name)} key={`treatment${index}`} className="bg-slate-50 text-black py-2 px-4 rounded-xl shadow-md text-lg cursor-pointer hover:bg-red-400 hover:text-white transition-all">{treatmentProfile.name}</p>
                            })
                            }
                        </div>

                        <div className="flex flex-col pt-5 gap-2">
                            < label className="font-semibold text-xl">Добавить профиль лечения</label>
                            <div className="flex flex-row gap-4">
                                <input ref={treatment} className="outline-yellow-500 w-full px-4 h-14 py-4 rounded-lg" type="text" placeholder="Название профиля лечения"></input>
                                <button onClick={() => handleAddTreatmentClick()} className="color-grey w-fit h-full self-end font-semibold px-8 py-4 align-middle text-white text-lg shadow-lg eye bg-yellow-500 rounded-full hover:bg-yellow-400">Добавить</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-2xl text-black font-semibold pt-4">Список всех текущих санаториев:</p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            {sanatoriums?.map((sanatorium, index) => {
                                return <div onClick={() => handleSanatoriumDelete(sanatorium.name)} key={`sanatorium${index}`} className="group bg-slate-50 text-black text-lg rounded-xl cursor-pointer hover:bg-red-400 hover:text-white transition-all">
                                    <p className="py-2 px-4">{`Название: ${sanatorium.name}`}</p>
                                    <p className="py-2 px-4">{`Описание: ${sanatorium.description}`}</p>
                                    <p className="py-2 px-4">{`Адрес: ${sanatorium.location}`}</p>
                                    <p className="py-2 px-4">{`Цена: ${sanatorium.price}`}</p>
                                    <div className="flex gap-2 flex-wrap py-2 px-4">
                                        {sanatorium.treatmentProfiles.map((profile, index) => <div key={`profile${index}`} className="bg-slate-50 text-purple-500 py-1 px-2 rounded-full shadow-md w-fit cursor-pointer transition-all group-hover:bg-red-300 group-hover:text-white">{profile.name}</div>)}
                                    </div>
                                </div>
                            })
                            }
                        </div>
                    </div>
                </div>

                <Footer />

            </div >
        </>
    )
}

export default Admin
