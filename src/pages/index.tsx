import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGear, faCaretDown, faXmark } from '@fortawesome/free-solid-svg-icons'
import { api } from "~/utils/api";
import Footer from "~/components/Footer";
import SanatoriumCard from "~/components/SanatoriumCard";
import sanatorium from "./sanatorium";

type Treatment = {
  name: string,
  selected: boolean,
}

type Sanatorium = {
  name: string,
  selected: boolean,
}

export default function Home() {

  const search = useRef<HTMLInputElement>(null);
  const datefrom = useRef<HTMLInputElement>(null);
  const dateto = useRef<HTMLInputElement>(null);
  const days = useRef<HTMLInputElement>(null);


  const { data: AllTreatments } = api.treatment.getAll.useQuery();

  const { data: sanatoriums } = api.sanatorium.getMainInfo.useQuery();

  const [treatmentProfiles, setTreatmentProfiles] = useState([] as Treatment[]);

  const [selectedSanatoriums, setSelectedSanatoriums] = useState([] as Sanatorium[])

  const [openSanatoriumMenu, setOpenSanatoriumMenu] = useState(false);

  const [sanatoriumsSelected, setSanatoriumSelected] = useState(false);

  useEffect(() => {
    if (AllTreatments) {
      setTreatmentProfiles(AllTreatments.map((treatment) => ({ name: treatment.name, selected: false })));
    }
  }, [AllTreatments])

  useEffect(() => {
    if (sanatoriums) {
      setSelectedSanatoriums(sanatoriums.map((sanatorium) => ({ name: sanatorium.name, selected: false })));
    }
  }, [sanatoriums])

  const handleProfileClick = (num: number) => {
    const newTreatmentProfiles: Treatment[] = treatmentProfiles.map((profile, index) =>
      ({ name: profile.name, selected: num === index ? !profile.selected : profile.selected }))
    setTreatmentProfiles(newTreatmentProfiles);
  }

  const handleResetClick = () => {
    if (search.current) {
      search.current.value = "";
    }
    if (datefrom.current) {
      datefrom.current.value = "";
    }
    if (dateto.current) {
      dateto.current.value = "";
    }
    if (days.current) {
      days.current.value = "";
    }
    const resetTreatmentProfiles = treatmentProfile?.map((profile) => ({ name: profile.name, selected: false }));
    if (resetTreatmentProfiles) setTreatmentProfiles(resetTreatmentProfiles);
    const resetSanatoriumItems = selectedSanatoriums?.map((sanatorium) => ({ name: sanatorium.name, selected: false }));
    setSelectedSanatoriums(resetSanatoriumItems);
    setSanatoriumSelected(false);
  };

  const handleSearchClick = () => {
    handleResetClick();

  }

  const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [callback]);

    return ref;
  };

  const sanatoriumMenu = useOutsideClick(() => {
    setOpenSanatoriumMenu(false);
  })


  // useEffect(() => {
  //   if (sanatoriumMenu) {
  //     const onClick = e => sanatoriumMenu.contains(e.target) || console.log('клик вне компонента');
  //     document.addEventListener('click', onClick);
  //   }
  //   return () => document.removeEventListener('click', onClick);
  // }, [sanatoriumMenu]);

  const handleDeleteSanatoriumItemClick = (name: string) => {
    const newSelectedSanatoriums: Sanatorium[] = selectedSanatoriums.map((sanatorium) =>
      ({ name: sanatorium.name, selected: name === sanatorium.name ? !sanatorium.selected : sanatorium.selected }))
    setSelectedSanatoriums(newSelectedSanatoriums);
    if (newSelectedSanatoriums.filter((sanatorium) => sanatorium.selected).length === 0) {
      setSanatoriumSelected(false);
    }
  }

  const handleSanatoriumSelectClick = (name: string) => {
    const newSelectedSanatoriums: Sanatorium[] = selectedSanatoriums.map((sanatorium) =>
      ({ name: sanatorium.name, selected: name === sanatorium.name ? !sanatorium.selected : sanatorium.selected }))
    setSelectedSanatoriums(newSelectedSanatoriums);
    if (newSelectedSanatoriums.filter((sanatorium) => sanatorium.selected).length === 0) {
      setSanatoriumSelected(false);
    }
    else {
      setSanatoriumSelected(true);
    }
  }

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

          <p className="text-white text-5xl pt-10 text-center font-bold">Поиск санаторно-курортного лечения и отдыха в Узбекистане</p>
          <p className="text-white text-xl pt-5 pb-7 text-center font-semibold"></p>

          <div className="flex flex-col gap-1 pt-4">
            <div className="flex gap-1">
              <div className="group flex-1">
                <p className="text-white pl-4 mb-2">Дата заезда от</p>
                <input defaultValue={"Дата заезда от"} ref={datefrom} className="outline-yellow-500 px-4 py-4 h-14 rounded-tl-lg w-full" type="date" placeholder="Дата заезда от"></input>
              </div>

              <div className="group flex-1">
                <p className="text-white pl-4 mb-2">Дата заезда до</p>
                <input ref={dateto} className="outline-yellow-500 px-4 py-4 h-14 w-full" type="date" placeholder="Дата заезда до"></input>
              </div>

              <div className="group flex-1">
                <p className="text-white pl-4 mb-2">Количество дней</p>
                {/* <p className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 text-white pl-4 mb-2 transition-all">Количество дней</p> */}
                <input ref={days} className="outline-yellow-500 px-4 py-4 rounded-tr-lg h-14 w-full" type="number" placeholder="Количество дней"></input>
              </div>
            </div>

            <div ref={sanatoriumMenu} className="group relative">
              <div className="outline-yellow-500 w-full px-4 h-14 py-1 rounded-b-lg bg-white flex justify-between items-center">
                <div className="flex gap-2">
                  {!sanatoriumsSelected && <p className="text-slate-400">Выберите один или несколько санаториев</p>}
                  {selectedSanatoriums.map((sanatorium, index) =>
                    sanatorium.selected &&
                    <div onClick={() => handleDeleteSanatoriumItemClick(sanatorium.name)} key={`selectedSanatorium${index}`} className="text-slate-600 flex gap-2 items-center bg-purple-200 rounded-full border-purple-500 border-2 py-1 px-2 cursor-pointer">
                      <p className="text-center text-sm font-medium self-center">{sanatorium.name}</p>
                      <FontAwesomeIcon icon={faXmark} className="h-4 w-4 opacity-70" />
                    </div>
                  )}
                </div>
                <FontAwesomeIcon onClick={() => setOpenSanatoriumMenu((prev) => !prev)} icon={faCaretDown} style={{ color: "#000000", }} className="cursor-pointer w-6 h-6 opacity-50 group-hover:opacity-80 transition-all" />
              </div>
              {openSanatoriumMenu &&
                <div className="absolute bg-white z-10 w-full mt-2 rounded-lg overflow-hidden">
                  {selectedSanatoriums.map((sanatorium, index) =>
                    <>
                      <div className="flex relative">
                        {sanatorium.selected && <div className="bg-yellow-500 w-[3px] my-[1px] h-full rounded-full hover:bg-purple-400 transition-all absolute"></div>}
                        <div onClick={() => handleSanatoriumSelectClick(sanatorium.name)} className={sanatorium.selected ? "transition-all py-2 px-4 hover:bg-purple-400 hover:text-white flex-1" : "bg-white transition-all py-2 px-4 hover:bg-purple-400 hover:text-white flex-1"} key={`sanatorium-element-${index}`}>{sanatorium.name}</div>
                      </div>
                    </>
                  )}
                </div>
              }
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-10 pb-6">
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
        </header >


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
