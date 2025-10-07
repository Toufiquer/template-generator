import { DateRange } from 'react-day-picker'

export interface DataItem {
    id: number
    title: string
    quantity: number
}

export interface ITesta {
    title: string
    students: DataItem[]
    createdAt: Date
    updatedAt: Date
    _id: string
}

export const defaultTesta = {
    title: '',
    students: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
