import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGear } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
    return (
        <header className='xl:px-40 lg:px-20 px-5 flex flex-col w-full bg-gradient-to-t from-purple-600 to-purple-800'>

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
        </header>
    )
}

export default Header