import { ILocalization } from '../models/localization';

interface IDict {
    [key: string]: {
        [key: string]: string;
    };
}

export default function getLocalization(dict: IDict, language: string) {
    let translated = {} as ILocalization;
    for (let key in dict) {
        translated[key] = dict[key][language] || dict[key].en;
    }
    return translated;
}
