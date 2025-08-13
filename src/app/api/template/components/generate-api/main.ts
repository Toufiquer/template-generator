import { NextRequest } from 'next/server'
import generateController from './generate-controller'
import writeInFile from '../create-and-write'

const generateApi = async (request: NextRequest) => {
    //  !  create api
    const { data } = await request.json()
    console.log('Data : ', data)
    const controllerTemplate = generateController(data)
    writeInFile(controllerTemplate, 'src/app/generate/example/page.tsx')
}
export default generateApi
