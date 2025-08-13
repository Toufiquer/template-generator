import { users_2_000___Api } from './../../../../dashboard/template-demo-string/all/redux/rtk-Api'
import { NextRequest } from 'next/server'
import generateController from './generate-controller'
import writeInFile from '../create-and-write'
import { generateModel } from './generate-model'
import { generateRoute } from './generate-route'

const generateApi = async (data: string) => {
    //  !  create api
    let folderName = 'example'

    // console.log('Data : ', data)
    const { namingConvention } = JSON.parse(data) || {}
    if (namingConvention.users_2_000___) {
        folderName = namingConvention.users_2_000___
    }

    const controllerTemplate = generateController(data)
    const medelTemplate = generateModel(data)
    const routeTemplate = generateRoute(data)
    writeInFile(
        controllerTemplate,
        `src/app/generate/${folderName}/all/api/v1/controller.tsx`
    )
    writeInFile(
        medelTemplate,
        `src/app/generate/${folderName}/all/api/v1/model.tsx`
    )
    writeInFile(
        routeTemplate,
        `src/app/generate/${folderName}/all/api/v1/route.tsx`
    )
}
export default generateApi
