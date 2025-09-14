'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Dynamically generated type for the data state
type Data = {
    "title1"?: string;
    "title2"?: string;
    "title3"?: string;
    "title4"?: string;
    "title5"?: string;
    "title6"?: string
}

const Page = () => {
    const [data, setData] = useState<Data | null>(null)
    const pathname = usePathname()
    const id = pathname.split('/')[5]

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const token = process.env.NEXT_PUBLIC_Token
                if (!token) {
                    console.error(
                        'Authentication token not found. Unable to fetch data.'
                    )
                    return
                }

                const url = `http://localhost:3000/dashboard/news1/all/api/v1?id=${id}`
                
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })

                    const responseData = await response.json()
                    setData(responseData?.data)
                } catch (error) {
                    console.error('Failed to fetch data:', error)
                }
            }
            fetchData()
        }
    }, [id])
    
    return (
        <div className="w-full flex flex-col md:p-4 p-1 gap-4">
            <div className="border border-slate-400 rounded-md overflow-hidden">
                <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">title1:</strong> {data?.["title1"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">title2:</strong> {data?.["title2"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">title3:</strong> {data?.["title3"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">title4:</strong> {data?.["title4"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">title5:</strong> {data?.["title5"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">title6:</strong> {data?.["title6"]?.toString()}
            </div>
            </div>
            <Link
                href="/dashboard/news1es"
                className="w-full text-center hover:bg-slate-400 bg-slate-300 p-2 border border-slate-400 rounded-md"
            >
                Back to List
            </Link>
        </div>
    )
}
export default Page
