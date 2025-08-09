// app/api/generate-model/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        //  !  create api
        const { data } = await request.json()
        console.log('Data : ', data)
        return NextResponse.json({ message: 'file found' }, { status: 200 })
    } catch (e) {
        console.log(e)
        return NextResponse.json(
            { message: 'Error creating file' },
            { status: 500 }
        )
    }
}
