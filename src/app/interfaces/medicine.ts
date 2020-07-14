import { Parent } from './parent';
import { AffectiveMaterial } from './affective-material';
import { License } from './license';
import { Location } from './location';
import { Manufacturer } from './manufacturer';
import { MedicineType } from './medicine-type';
import { Pharmacy } from './pharmacy';

export interface Medicine extends Parent {
    title: {
        label: string,
        value: any
    };
    medicine_type_id: number;
    license_id: number;
    location_id: number;
    manufacturer_id: number;
    expiration_date: Date | string;
    affective_materials: Array<AffectiveMaterial>;
    pharmacies: Array<Pharmacy>;
    license: {label: string, value: License};
    location: {label: string, value: Location};
    manufacturer: {label: string, value: Manufacturer};
    medicine_type: {label: string, value: MedicineType};
    // _title: string;
    // _medicine_type: string;
    // _location: string;
    // _manufacturer: string;
    // _license: string;
    _affective_materials: any[];
    // medicine_pharmacies?: Array<{medicine_id: number, pharmacy_id: number, last_checked_date: Date | string}>;
    medicine_pharmacies?: {[key: string]: {medicine_id: number, pharmacy_id: number, last_checked_date: Date | string}};
    show_pharmacies?: boolean;
}
