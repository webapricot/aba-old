import { Parent } from './parent';
import { PharmacyType } from './pharmacy-type';
import { Location } from './location';
import { PharmacyWorkTime } from './pharmacy-work-time';

export interface Pharmacy extends Parent {
    title: {label: string, value: any};
    location_id: number;
    address: {label: string, value: any};
    phone: {label: string, value: any};
    pharmacy_types: Array<PharmacyType>;
    _pharmacy_types: any[];
    location: { label: string, value: Location };
    pharmacy_work_time: { label: string, value: PharmacyWorkTime };
    pharmacy_work_time_id: number;
    pivot?: any;
    pivot_key?: string;
}
