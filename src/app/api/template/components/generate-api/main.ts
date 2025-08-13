import { NextRequest } from 'next/server'

const generateApi = async (request: NextRequest) => {
    //  !  create api
    const { data } = await request.json()
    console.log('Data : ', data)
}
export default generateApi
