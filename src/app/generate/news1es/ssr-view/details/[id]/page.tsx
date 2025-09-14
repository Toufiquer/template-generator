import { notFound } from 'next/navigation'
import HomeButton from './HomeButton'

// Dynamically generated interface based on the schema
interface INews1 {
    "title1": string;
    "title2": string;
    "title3": string;
    "title4": string;
    "title5": string;
    "title6": string;
    _id: string;
}

interface ApiResponse {
    data: INews1;
    message: string;
    status: number;
}

const DataDetails = ({ data }: { data: INews1 }) => {
    return (
        <div className="w-full flex flex-col md:p-4 p-1 gap-4">
            <h1 className="text-2xl font-bold">News1 Details</h1>
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
            <HomeButton />
        </div>
    )
}

const getDataById = async (id: string): Promise<ApiResponse> => {
    const backendUrl = `http://localhost:3000/generate/news1es/all/api/v1?id=${id}`

    try {
        const res = await fetch(backendUrl, { next: { revalidate: 3600 } }) // 1 hour cache
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        const responseData: ApiResponse = await res.json()
        if (!responseData || !responseData.data) {
             notFound()
        }
        return responseData
    } catch (error) {
        console.error('Failed to fetch News1:', error)
        notFound();
    }
}

async function getData(id: string) {
    const data = await getDataById(id)
    if (!data) notFound()
    return data
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { id } = params
    const data = await getData(id)

    return {
        title: data?.data?.["title1"]?.toString() || 'News1',
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params
    const data = await getData(id)
    return (
        <div className="py-12 flex flex-col w-full">
            <DataDetails data={data.data} />
        </div>
    )
}
