import Head from "next/head";
import { useRef, useState } from "react";
import { api } from "~/utils/api";

import React from 'react'


const Admin = () => {

    // const getSanatoriumCards = api.example.getSanatoriumCards.useQuery();
    const getTreatments = api.treatment.getAll.useQuery();
    const createTreatment = api.treatment.create.useMutation();
    const deleteTreatment = api.treatment.delete.useMutation();

    const treatment = useRef<HTMLInputElement>(null);

    // Обработка профилей лечения

    const [request, setRequest] = useState(true);

    const [treatmentProfiles, setTreatmentProfiles] = useState([] as string[]);

    if (request) {
        const treatmentData = getTreatments.data;
        if (treatmentData) {
            const treatmentProfile: string[] = treatmentData.map((treatmentprofile) => treatmentprofile.name);
            setTreatmentProfiles(treatmentProfile);
            setRequest(false);
        }
    }

    // Обработчики кликов
    const handleAddTreatmentClick = () => {
        if (treatment.current) {
            const profile: string = treatment.current.value
            createTreatment.mutate({ name: profile });
            treatment.current.value = "";
            setTreatmentProfiles((prevTreatment) => [
                ...prevTreatment, profile
            ]);
        }
    }

    const handleTreatmentDelete = (treatmentProfile: string) => {
        deleteTreatment.mutate({ name: treatmentProfile.toString() });
        setTreatmentProfiles(treatmentProfiles.filter((profile) => profile !== treatmentProfile))
    }

    // let treatmentProfile: string[] = [];

    // ["Лор органы", "Гастроэнтерология", "Желчевыделительная система", "Мочеполовая система", "Гинекология", "Имунная система", "Нарушение обмена веществ"]

    return (

        <>
            <Head>
                <title>Поиск санаториев</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="bg-slate-100 min-h-screen xl:px-40 lg:px-20 px-5 w-full ">

                <div className="">
                    <p className="text-2xl text-black font-semibold pt-4">Список всех текущих профилей лечения:</p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        {treatmentProfiles.map((treatmentProfile, index) => {
                            return <p onClick={() => handleTreatmentDelete(treatmentProfile)} key={`treatment${index}`} className="bg-slate-50 text-black py-2 px-4 rounded-xl shadow-md text-lg cursor-pointer hover:bg-red-400 hover:text-white transition-all">{treatmentProfile}</p>
                        })
                        }
                    </div>
                </div>

                <div className="flex flex-col pt-5 gap-2">
                    < label className="font-semibold text-xl">Добавить профиль лечения</label>
                    <div className="flex flex-row gap-4">
                        <input ref={treatment} className="outline-yellow-500 w-full px-4 h-14 py-4 rounded-lg" type="text" placeholder="Название профиля лечения"></input>
                        <button onClick={() => handleAddTreatmentClick()} className="color-grey w-fit h-full self-end font-semibold px-8 py-4 align-middle text-white text-lg shadow-lg eye bg-yellow-500 rounded-full hover:bg-yellow-400">Добавить</button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Admin