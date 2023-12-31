import Head from "next/head";
import Footer from "~/components/Footer";
import Header from "~/components/Header";

const sanatoriumData = {
    name: "Санаторий Заполярье",
    location: "Сочи",
    price: "4300",
    rating: "4.7",
    description: "Полезная информация о санатории",
    treatmentProfiles: [2, 4, 6, 7, 8, 9, 11],
    images: ["/assets/1.webp", "/assets/2.webp", "/assets/3.webp", "/assets/4.webp", "/assets/5.jpg"],
    comments: [{ author: "Валерий П.", message: "Отличный санаторий" }, { author: "Светлана", message: "Очень красивое место" }]
};

const treatmentProfile = ["Аллергия", "Дыхательная система", "Кожные заболевания", "Беременность", "Желудочно-кишечный тракт", "Лор органы", "Гастроэнтерология", "Желчевыделительная система", "Мочеполовая система", "Гинекология", "Имунная система", "Нарушение обмена веществ"];

const sanatorium = () => {

    return (
        <>
            <Head>
                <title>Поиск санаториев</title>
                <meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col min-h-screen text-lg w-full">

                <Header />

                <div className="xl:px-40 lg:px-20 px-5 pt-6">

                    <div className="relative w-full max-h-[30rem] overflow-hidden group rounded-3xl">
                        <div className="absolute h-full w-full cursor-pointer bg-gradient-to-b from-[#00000000] to-[#000000c7] group-hover:to-[#00000096] transition-all"></div>
                        <img className="object-cover transition-all h-full w-full" src={sanatoriumData.images[4]} alt={`sanatorium`} />
                        <p className="absolute text-white text-xl bottom-3 px-5 lg:text-3xl lg:bottom-8 lg:px-10 opacity-50 group-hover:opacity-100 transition-all">{sanatoriumData.name}</p>
                        <p className="absolute text-white text-xl bottom-3 px-5 right-0 lg:text-3xl lg:bottom-8 lg:px-10 lg:right-0 opacity-50 group-hover:opacity-100 transition-all">{sanatoriumData.rating}</p>
                    </div>

                    <p className="font-semibold text-black text-2xl pt-5">Общая информация</p>
                    <div className="pt-6 flex flex-col w-full gap-2 justify-start flex-wrap">
                        <p>{`Адрес: ${sanatoriumData.location}`}</p>
                        <p>{`Описание: ${sanatoriumData.description}`}</p>
                        <p>{`Стоимость: ${sanatoriumData.price}руб/сутки`}</p>
                    </div>

                    <p className="font-semibold text-black text-2xl pt-5">Галерея</p>
                    <div className="pt-6 flex flex-row w-full gap-2 justify-start flex-wrap">
                        {sanatoriumData.images.map((img, index) => {
                            return <div key={`image${index}`} className="group shadow-xl rounded-2xl overflow-hidden h-60 transition-all">
                                <img className="group-hover:scale-110 object-cover transition-all h-full" src={img} alt={`sanatorium${index}`} />
                            </div>
                        })}
                    </div>

                    <p className="font-semibold text-black text-2xl pt-5">Профили лечения</p>
                    <div className="pt-6 flex flex-row w-full gap-2 justify-start flex-wrap">
                        {sanatoriumData.treatmentProfiles.map((treatment, index) => {
                            return <div key={`treatment${index}`} className="bg-slate-50 text-purple-500 py-2 px-4 rounded-full shadow-md text-lg cursor-pointer">{treatmentProfile[treatment]}</div>
                        })}
                    </div>

                    <p className="font-semibold text-black text-2xl pt-5">Питание</p>
                    <div className="pt-6 flex flex-row w-full gap-2 justify-start flex-wrap">
                        Информация
                    </div>

                    <p className="font-semibold text-black text-2xl pt-5">Отзывы</p>
                    <div className="pt-6 flex flex-row w-full gap-5 justify-start flex-wrap">

                        {sanatoriumData.comments.map((comment, index) => {
                            return <div key={`comment${index}`} className="bg-slate-50 text-black py-3 px-4 rounded-xl shadow-md text-lg cursor-pointer">
                                <p className="pb-1 opacity-70">{comment.author}</p>
                                <p>{comment.message}</p>
                            </div>
                        })}

                    </div>

                </div>
                <Footer />

            </div>
        </>
    )
}

export default sanatorium
