// app/api/generate-model/route.ts
import { NextRequest, NextResponse } from 'next/server'
import generateApi from './components/generate-api/main'
import generateRtk from './components/generate-redux-toolkit/main'
import generateStore from './components/generate-sotre/main'
import generateSSRView from './components/generate-ssr-view/main'
import generateMainPage from './components/generate-main-page/main'

export async function POST(request: NextRequest) {
    try {
        // //  !  create api
        // const { data } = await request.json()
        // console.log('Data : ', data)
        const { data } = await request.json()
        generateApi(data)
        generateRtk(data)
        generateStore(data)
        generateSSRView(data)
        generateMainPage(data)

        return NextResponse.json({ message: 'file found' }, { status: 200 })
    } catch (e) {
        console.log(e)
        return NextResponse.json(
            { message: 'Error creating file' },
            { status: 500 }
        )
    }
}
