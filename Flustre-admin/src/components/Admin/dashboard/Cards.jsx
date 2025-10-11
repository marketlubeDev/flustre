import React from 'react'
import { IoDiamondSharp } from "react-icons/io5";
import { AiOutlineDeliveredProcedure } from "react-icons/ai";
import { GiMoneyStack } from "react-icons/gi";



function Cards({ count, data, color }) {

    const Icon = () => {
        if (data == "Total Orders") {
            return (
                <div className={` bg-[#00BA9D] p-2 flex items-center`}><IoDiamondSharp className='text-4xl text-white' /></div>
            )
        }
        if (data == "Total Deliveries") {
            return (
                <div className={` bg-[#FF5470] p-2 flex items-center`}><AiOutlineDeliveredProcedure className='text-4xl text-white' /></div>
            )
        }
        if (data == "Total Revenue") {
            return (
                <div className={` bg-[#035ECF] p-2 flex items-center`}><GiMoneyStack className='text-4xl text-white' /></div>
            )
        }
    }

    return (
        <div className='min-w-64'>
            <div className="flex items-center gap-4 max-w-sm p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <div className={` bg-[${color}] p-2 flex items-center`}>
                    <Icon />
                </div>
                <div>
                    <h5 className=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{count}</h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{data}</p>
                </div>
            </div>
        </div>

    )
}

export default Cards
