export class TableDataModel {
    constructor() { }

    setTableData(arr: any[]): any {
        const clonedArr = [];
        arr.forEach(item => {

            const clonedObj = {
                label: '',
                value: {}
            };
            clonedObj.value = item;
            clonedObj.label = item.title ? item.title : item.name;
            clonedArr.push({...clonedObj});
        });
        return [...clonedArr];
    }

    setUniqueTableData(obj: any, arr?: any[]): any {
        if (typeof obj === 'string' || obj instanceof String) {
            const clonedObj = {
                label: obj,
                value: {title: obj}
            };
            return clonedObj;
        }
        let selectedItem;
        if (arr.length !== 0) {
            selectedItem = arr.find(item => {
                return item.value.id === obj.id;
            });
        }
        if (selectedItem) {
            return {...selectedItem};
        }
    }

    setMultiselectTableData(selecteds: any[], arr: any[]) {
        const returnedArr = [];
        const selectedsArr = [];
        arr.forEach(item => {
            selecteds.forEach(selectedItem => {
                if (item.value.id === selectedItem.id) {
                    selectedsArr.push(item);
                }
            });
        });
        selectedsArr.forEach(selectedItem => {
            returnedArr.push(selectedItem.value);
        });
        return returnedArr;
    }

    setMultiselectShowData(arr: any[]) {
        const clonedArr = [];
        arr.forEach(item => {
            let clonedItem = '';
            clonedItem = item.title;
            clonedArr.push(clonedItem);
        });
        return clonedArr;
    }

    setCreatedItemTableData(item: any): any {
        const clonedObj = {
            label: '',
            value: {}
        };
        clonedObj.value = item;
        clonedObj.label = item.title ? item.title : item.name;
        return {...clonedObj};
    }
}
