import { notFound } from 'next/navigation'
import HomeButton from './HomeButton'

// Dynamically generated interface based on the schema
interface ITesta {
    "title": string;
    "students": Array<{ Name: string; Class: string; Roll: string }>;
    _id: string;
}

interface ApiResponse {
    data: ITesta;
    message: string;
    status: number;
}

const DataDetails = ({ data }: { data: ITesta }) => {
    return (
        <div className="w-full flex flex-col md:p-4 p-1 gap-4">
            <h1 className="text-2xl font-bold">Testa Details</h1>
            <div className="border border-slate-300 rounded-md overflow-hidden dark:border-slate-600">
                <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">title:</strong> {data?.["title"]?.toString()}
            </div>
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">students:</strong> <pre className="text-sm">{JSON.stringify(data?.["students"], null, 2)}</pre>
            </div>
            </div>
            <HomeButton />
        </div>
    )
}

const getDataById = async (id: string): Promise<ApiResponse> => {
    // Ensure the backend URL is correctly configured, especially for production.
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const backendUrl = `${baseUrl}/generate/testa/all/api/v1?id=${id}`

    try {
        const res = await fetch(backendUrl, { next: { revalidate: 3600 } }) // 1 hour cache
        if (!res.ok) {
            // Log the error for debugging purposes on the server.
            console.error('API fetch failed with status:', res.status);
            // Gracefully handle not found errors from the API.
            if (res.status === 404) {
                notFound();
            }
            throw new Error('Failed to fetch data');
        }
        const responseData: ApiResponse = await res.json()
        if (!responseData || !responseData.data) {
             notFound()
        }
        return responseData
    } catch (error) {
        console.error('Failed to fetch Testa:', error)
        notFound();
    }
}

async function getData(id: string) {
    const data = await getDataById(id)
    // The notFound() call is handled within getDataById, so this check is redundant
    // but safe to keep.
    if (!data) notFound()
    return data
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { id } = params
    const data = await getData(id)

    // Safely access the display key, providing a fallback title.
    return {
        title: data?.data?.["title"]?.toString() || 'Testa',
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
