import Head from "next/head";
import { useRef, useState } from "react";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGear } from '@fortawesome/free-solid-svg-icons'

/* eslint-disable */
export default function Home() {
  const hello = api.example.hello.useQuery({ text: "backend" });

  // const [treatment, setTreatment] = useState(false);
  // const [vacation, setVacation] = useState(false);

  const search = useRef<HTMLInputElement>(null);
  const date = useRef<HTMLInputElement>(null);
  const days = useRef<HTMLInputElement>(null);

  const sanatoriums = [
    {
      name: "Пансионат Бургас",
      location: "Сочи",
      img: "/assets/1.webp",
      price: "2550",
      rating: "4.6",
      description: "",
      treatmentProfiles: [1, 4, 5, 7, 8, 11]
    },
    {
      name: "Санаторий Янган-Тау",
      location: "Республика Башкортостан",
      img: "/assets/2.webp",
      price: "4600",
      rating: "4.8",
      description: "",
      treatmentProfiles: [2, 3, 4, 5, 9, 10]
    },
    {
      name: "Санаторий Лесники",
      location: "Курганская область",
      img: "/assets/3.webp",
      price: "3160",
      rating: "5",
      description: "",
      treatmentProfiles: [0, 1, 2, 8, 9, 10, 11]
    },
    {
      name: "Санаторий Урал",
      location: "Челябинская область",
      img: "/assets/4.webp",
      price: "2600",
      rating: "4.6",
      description: "",
      treatmentProfiles: [0, 3, 6, 7, 9, 10]
    },
    {
      name: "Санаторий Заполярье",
      location: "Сочи",
      img: "/assets/5.jpg",
      price: "4300",
      rating: "4.7",
      description: "",
      treatmentProfiles: [2, 4, 6, 7, 8, 9, 11]
    }
  ]
  
  const treatmentProfile = ["Аллергия", "Дыхательная система", "Кожные заболевания", "Беременность", "Желудочно-кишечный тракт", "Лор органы", "Гастроэнтерология", "Желчевыделительная система", "Мочеполовая система", "Гинекология", "Имунная система", "Нарушение обмена веществ"]

  const [treatmentProfiles, setTreatmentProfiles] = useState(Array(treatmentProfile.length).fill(false));

  const handleProfileClick = (num: number) => {
    setTreatmentProfiles(
      treatmentProfiles.map((profile, index) =>
        index === num ? !treatmentProfiles[index] : treatmentProfiles[index])
    );
  };

  const handleResetClick = () => {
    search.current!.value = "";
    date.current!.value = "";
    days.current!.value = "";
    const resetTreatmentProfiles = Array(treatmentProfile.length).fill(false);
    setTreatmentProfiles(resetTreatmentProfiles);
  };

  const handleSearchClick = () => {
    console.log(search.current!.value);
    console.log(date.current!.value);
    console.log(days.current!.value);
    console.log(treatmentProfiles);

    handleResetClick();
  }


  return (
    <>
      <Head>
        <title>Поиск санаториев</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className="flex flex-col min-h-screen text-lg w-fit">

        <header className='xl:px-40 lg:px-20 px-5 w-fit flex flex-col bg-gradient-to-t from-purple-600 to-purple-800'>
          

          <div className="flex justify-between py-5">
            
            <div className="flex gap-4 text-white text-lg">
              <p className="text-xl font-semibold">Логотип</p>
              <p className="text-xl font-semibold">Название</p>
            </div>

            <div className="flex gap-6 text-white align-middle justify-center">
              <FontAwesomeIcon icon={faUser} size="xl" className="hover:cursor-pointer"/>
              <FontAwesomeIcon icon={faGear} size="xl" className="hover:cursor-pointer"/>
            </div>

          </div>

          <p className="text-white text-5xl pt-10 text-center font-bold">Поиск санаториев</p>
          <p className="text-white text-xl pt-5 pb-7 text-center font-semibold">Экономим ваше время и деньги</p>

          {/* <div className="flex flex-row gap-4 justify-center">
            <div onClick={() => setVacation(!vacation)} className={vacation ? "flex bg-white rounded-lg text-purple-600 font-semibold px-6 py-1 my-2 items-center transition-all shadow-md cursor-pointer" : "flex opacity-50 bg-purple-500 text-white rounded-lg font-semibold px-6 py-1 my-2 items-center transition-colors shadow-md cursor-pointer"}>
              <p>Отдых</p>
            </div>

            <div onClick={() => setTreatment(!treatment)} className={treatment ? "flex bg-white rounded-lg text-purple-600 font-semibold px-6 py-1 my-2 items-center transition-all shadow-md cursor-pointer" : "flex opacity-50 bg-purple-500 text-white rounded-lg font-semibold px-6 py-1 my-2 items-center transition-all shadow-md cursor-pointer"}>
              <p>Лечение</p>
            </div>
          </div> */}

          <div className="flex gap-1 pt-4">
            <div className="grow group">
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
            {treatmentProfile.map((profile, index) => {
              return <div onClick={() => {handleProfileClick(index)}} className={treatmentProfiles[index] ? "flex grow bg-white rounded-lg text-purple-600 font-semibold px-6 py-1 my-2 items-center transition-all shadow-md cursor-pointer" : "flex grow opacity-50 bg-purple-500 text-white rounded-lg font-semibold px-6 py-1 my-2 items-center transition-colors shadow-md cursor-pointer hover:bg-purple-400"}>
                        <p className="text-center w-full">{profile}</p>
                      </div>
              })
            }
          </div>
          
          <div className="flex justify-between gap-5 align-middle mb-8">
            <button onClick={() => {handleResetClick()}}  className="text-bg text-purple-300 opacity-60 hover:opacity:30 hover:text-white transition-all">Сброс</button>
            <div>
              <button className="text-bg mr-5 text-purple-300 opacity-60 hover:opacity:30 hover:text-white transition-all">Расширенный поиск</button>
              <button onClick={() => handleSearchClick()} className="color-grey w-fit self-end font-semibold px-8 py-2 text-white text-lg shadow-lg eye bg-yellow-500 rounded-full hover:bg-yellow-400">Искать</button>
            </div>
          </div>
        </header>

        <div className="xl:px-40 lg:px-20 px-5 w-full">

            <p className="text-4xl font-semibold text-black pt-10 pb-4">Популярно сейчас</p>
            <div className="flex flex-row flex-wrap py-6 gap-6 justify-between">
              {sanatoriums.map((sanatorium, index) => {
                return <a href="/sanatorium" className="group relative w-full md:w-[48%] h-fit text-white text-4xl font-semibold rounded-3xl overflow-hidden shadow-lg">
                          <div className="relative w-full h-70 overflow-hidden">
                            <div className="absolute h-full w-full cursor-pointer bg-gradient-to-b from-[#00000000] to-[#000000c7] group-hover:to-[#00000096] transition-all"></div>
                            <img className="object-cover transition-all" src={sanatorium.img} alt={`sanatorium${index}`}/>
                            <p className="absolute bottom-6 px-8 opacity-50 group-hover:opacity-100 transition-all">{sanatorium.name}</p>
                          </div>
                          <div className="px-8 py-3">
                            <p>{sanatorium.description}</p>
                            <p className="text-black text-xl font-normal pb-2">{`Стоимость за сутки: ${sanatorium.price} руб`}</p>
                            <p className="text-black text-xl font-normal pb-2">{`Рейтинг: ${sanatorium.rating}`}</p>
                            <div>
                              <p className="text-black text-xl font-normal pb-2">Профили:</p>
                              <div className="flex flex-wrap gap-3 pb-2">
                                {sanatorium.treatmentProfiles.map((treatment, index) => {
                                  return <div className="bg-slate-50 text-purple-500 py-2 px-4 rounded-full shadow-md text-lg cursor-pointer">{treatmentProfile[treatment]}</div>
                                })}
                              </div>
                            </div>
                          </div>
                        </a>
                })}
            </div>
          {/* <p className="text-2xl text-black">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p> */}
        </div>
        <footer className="xl:px-40 lg:px-20 px-5 bg-gradient-to-b from-purple-600 to-purple-800 mt-5">
          <div className="flex flex-row justify-around py-5 text-white font-semibold">
            <li className="flex flex-col">
              <a className="cursor-pointer">Ссылка</a>
              <a className="cursor-pointer">Ссылка</a>
              <a className="cursor-pointer">Ссылка</a>
            </li>
            <li className="flex flex-col">
              <a className="cursor-pointer">Ссылка</a>
              <a className="cursor-pointer">Ссылка</a>
              <a className="cursor-pointer">Ссылка</a>
            </li>
            <li className="flex flex-col">
              <a className="cursor-pointer">Ссылка</a>
              <a className="cursor-pointer">Ссылка</a>
              <a className="cursor-pointer">Ссылка</a>
            </li>

          </div>
        </footer>

      </div>
    </>
  );
}
