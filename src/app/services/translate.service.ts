import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor() { }

  words = {
    hy: {
      header: {
        pages: [
          {
            label : 'Գլխավոր',
            value : ''
          },
          {
            label : 'Արտադրողներ',
            value : ''
          },
          {
            label : 'Ազդող նյութեր',
            value : ''
          },
        ],
        sign_out: 'Ելք'
      },
      medicines_pharmacies: {
        title_medicine: 'Դեղեր',
        title_pharmacy: 'Դեղատներ',
        add: 'Ավելացնել',
        search: 'Փնտրել...',
        filter: 'Որոնում',
        new_manufacturer: 'Նոր արտադրող',
        new_affective_material: 'Նոր ազդող նյութ',
        new_manufacturer_name: 'Արտադրողի անուն',
        new_manufacturer_description: 'Նկարագրություն',
        new_affective_material_name: 'Ազդող նյութի անվանում',
        new_affective_material_description: 'Նկարագրություն',
        save_button: 'Պահպանել',
        cancel_button: 'Ջնջել',
        pharmacy_name: 'Անվանում',
        pharmacy_date: 'Ճշտման ամսաթիվ',
        choose_pharmacies: 'Ընտրել դեղատներ',
        choose_last_check_date: 'Նշել ամսաթիվ'
      }
    }
  };
}
