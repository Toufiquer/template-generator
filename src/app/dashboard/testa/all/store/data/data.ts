export interface StringArrayData {
    _id?: string
    Name: string
    Class: string
    Roll: number
}

export interface ITesta {
    title: string
    students: StringArrayData[]
    createdAt: Date
    updatedAt: Date
    _id?: string
}

export const defaultTesta = {
    title: '',
    students: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
