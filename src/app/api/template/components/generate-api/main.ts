import { NextRequest } from 'next/server'
import generateController from './generate-controller'
import writeInFile from '../create-and-write'
import { generateModel } from './generate-model'

const generateApi = async (request: NextRequest) => {
    //  !  create api
    const { data } = await request.json()
    console.log('Data : ', data)
    const controllerTemplate = generateController(data)
    const medelTemplate = generateModel(data)
    writeInFile(
        controllerTemplate,
        'src/app/generate/example/api/controller.tsx'
    )
    writeInFile(medelTemplate, 'src/app/generate/example/api/model.tsx')
}
export default generateApi
