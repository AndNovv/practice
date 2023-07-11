import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="xl:px-40 lg:px-20 px-5 bg-gradient-to-b from-purple-600 to-purple-800 mt-5">
            <div className="flex flex-row justify-around py-5 text-white font-semibold">
                <li className="flex flex-col">
                    <Link href="/" className="cursor-pointer">Главная</Link>
                    <Link href="/admin" className="cursor-pointer">Админ</Link>
                    <Link href="/sanatorium" className="cursor-pointer">Санаторий</Link>
                </li>
                <li className="flex flex-col">
                    <Link href="/edit" className="cursor-pointer">Настройка санатория</Link>
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
    )
}

export default Footer