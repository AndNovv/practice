import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGear, faStar } from '@fortawesome/free-solid-svg-icons'
import { api } from "~/utils/api";
import Footer from "~/components/Footer";
import SanatoriumCard from "~/components/SanatoriumCard";

type Treatment = {
  name: string,
  selected: boolean,
}

export default function Home() {
  // const getSanatoriumCards = api.example.getSanatoriumCards.useQuery();
  // const getTreatments = api.treatment.getAll.useQuery();

  const search = useRef<HTMLInputElement>(null);
  const date = useRef<HTMLInputElement>(null);
  const days = useRef<HTMLInputElement>(null);

  // const treatmentProfile = ["Аллергия", "Дыхательная система", "Кожные заболевания", "Беременность", "Желудочно-кишечный тракт", "Лор органы", "Гастроэнтерология", "Желчевыделительная система", "Мочеполовая система", "Гинекология", "Имунная система", "Нарушение обмена веществ"]

  const { data: AllTreatments } = api.treatment.getAll.useQuery();

  const [treatmentProfiles, setTreatmentProfiles] = useState([] as Treatment[]);

  useEffect(() => {
    if (AllTreatments) {
      setTreatmentProfiles(AllTreatments.map((treatment) => ({ name: treatment.name, selected: false })));
    }
  }, [AllTreatments])

  const handleProfileClick = (num: number) => {
    const newTreatmentProfiles: Treatment[] = treatmentProfiles.map((profile, index) =>
      ({ name: profile.name, selected: num === index ? !profile.selected : profile.selected }))
    setTreatmentProfiles(newTreatmentProfiles);
  }

  const handleResetClick = () => {
    if (search.current) {
      search.current.value = "";
    }
    if (date.current) {
      date.current.value = "";
    }
    if (days.current) {
      days.current.value = "";
    }
    const resetTreatmentProfiles = treatmentProfile?.map((profile) => ({ name: profile.name, selected: false }));
    if (resetTreatmentProfiles) setTreatmentProfiles(resetTreatmentProfiles);
  };

  const handleSearchClick = () => {
    handleResetClick();

    // search logic here:

  }

  const { data: sanatoriums } = api.sanatorium.getMainInfo.useQuery();

  const { data: treatmentProfile } = api.treatment.getAll.useQuery();

  return (


    <>
      <Head>
        <title>Поиск санаториев</title>
        <meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen text-lg w-full">

        <header className='xl:px-40 lg:px-20 px-5 w-full flex flex-col bg-gradient-to-t from-purple-600 to-purple-800'>

          <div className="flex justify-between py-5">

            <div className="flex gap-4 text-white text-lg">
              <p className="text-xl font-semibold">Логотип</p>
              <p className="text-xl font-semibold">Название</p>
            </div>

            <div className="flex gap-6 text-white align-middle justify-center">
              <FontAwesomeIcon icon={faUser} className="h-8 w-8 hover:cursor-pointer" />
              <FontAwesomeIcon icon={faGear} className="h-8 w-8 hover:cursor-pointer" />
            </div>

          </div>

          <p className="text-white text-5xl pt-10 text-center font-bold">Поиск санаториев</p>
          <p className="text-white text-xl pt-5 pb-7 text-center font-semibold">Экономим ваше время и деньги</p>

          <div className="flex gap-1 pt-4">
            <div className="group flex-1">
              <p className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 text-white pl-4 mb-2 transition-all whitespace-nowrap">Город или санаторий</p>
              <input ref={search} className="outline-yellow-500 w-full px-4 h-14 py-4 rounded-l-lg" type="text" placeholder="Город или санаторий"></input>
            </div>
            <div className="group">
              <p className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 text-white pl-4 mb-2 transition-all">Дата заезда</p>
              <input ref={date} className="outline-yellow-500 px-4 py-4 h-14" type="date" placeholder="Дата заезда"></input>
            </div>
            <div className="group">
              <p className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 text-white pl-4 mb-2 transition-all">Количество дней</p>
              <input ref={days} className="outline-yellow-500 px-4 py-4 rounded-r-lg h-14" type="number" placeholder="Количество дней"></input>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-8 pb-6">
            {treatmentProfile?.map((profile, index) => {
              return <div onClick={() => { handleProfileClick(index) }} key={`profile${index}`} className={treatmentProfiles[index]?.selected ? "flex grow bg-white rounded-lg text-purple-600 font-semibold px-6 py-1 my-2 items-center transition-all shadow-md cursor-pointer" : "flex grow opacity-50 bg-purple-500 text-white rounded-lg font-semibold px-6 py-1 my-2 items-center transition-colors shadow-md cursor-pointer hover:bg-purple-400"}>
                <p className="text-center w-full">{profile.name}</p>
              </div>
            })
            }
          </div>

          <div className="flex justify-between gap-5 align-middle mb-8">
            <button onClick={() => handleResetClick()} className="text-bg text-purple-300 opacity-60 hover:opacity:30 hover:text-white transition-all">Сброс</button>
            <div>
              <button className="text-bg mr-5 text-purple-300 opacity-60 hover:opacity:30 hover:text-white transition-all">Расширенный поиск</button>
              <button onClick={() => handleSearchClick()} className="color-grey w-fit self-end font-semibold px-8 py-2 text-white text-lg shadow-lg eye bg-yellow-500 rounded-full hover:bg-yellow-400">Искать</button>
            </div>
          </div>
        </header>


        <div className="xl:px-40 lg:px-20 px-5 w-full">
          <p className="text-4xl font-semibold text-black pt-10 pb-4">Популярно сейчас</p>
          <div className="flex flex-row flex-wrap py-6 gap-6 justify-between">
            {sanatoriums?.map((sanatorium, index) => {
              return <SanatoriumCard key={`Sanatorium${index}`} {...sanatorium} />
            })}
          </div>
        </div>

        <Footer />

      </div >
    </>
  );
}
