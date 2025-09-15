import { DateRange } from 'react-day-picker'

export interface ITest2s {
    title: string
    email: string
    password: string
    passcode: string
    area: string
    'books-list': string
    'check-list': string
    'sub-area': string
    'products-images': string[]
    'personal-image': string
    description: string
    age: number
    amount: number
    isActive: boolean
    'start-date': Date
    'start-time': string
    'schedule-date': DateRange | undefined
    'schedule-time': { start: string; end: string }
    'favorite-color': string
    number: string
    profile: string
    test: string
    info: string
    shift: string
    policy: boolean
    hobbys: string[]
    ideas: string
    createdAt: Date
    updatedAt: Date
    _id: string
}

export const defaultTest2s = {
    title: '',
    email: '',
    password: '',
    passcode: '',
    area: '',
    'books-list': '',
    'check-list': '',
    'sub-area': '',
    'products-images': [],
    'personal-image': '',
    description: '',
    age: 0,
    amount: 0,
    isActive: false,
    'start-date': new Date(),
    'start-time': '',
    'schedule-date': { from: new Date(), to: new Date() },
    'schedule-time': { start: '', end: '' },
    'favorite-color': '',
    number: '',
    profile: '',
    test: '',
    info: '',
    shift: '',
    policy: false,
    hobbys: [],
    ideas: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
