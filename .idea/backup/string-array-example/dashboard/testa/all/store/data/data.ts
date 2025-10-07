export interface DataItemArray {
    _id: string
    Name: string
    Roll: number
    Class: string
}
export interface ITesta {
    title: string
    students: DataItemArray[]
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
