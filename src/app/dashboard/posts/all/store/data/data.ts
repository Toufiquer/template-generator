
import { DateRange } from 'react-day-picker'
import { StringArrayData } from '../../components/others-field-type/types'

export interface IPosts {
    "title": string;
    "area": string;
    "sub-area": string[];
    "isActive": boolean;
    "policy": boolean;
    createdAt: Date;
    updatedAt: Date;
    _id?: string;
}

export const defaultPosts = {
    "title": '',
    "area": '',
    "sub-area": [],
    "isActive": false,
    "policy": false,
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
