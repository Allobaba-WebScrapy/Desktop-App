import {store} from '@/state/store'



const getCars = () => {
    const cars = store.getState().autoscout24.cars
    if (cars.length === 0) {
        alert('No Products Found in the table. Please scrape the products first.')
        return false
    }
    return cars
}

const downloadFile =(data:string,format:'json'|'csv')=>{
    const encodedUri = encodeURI(data)
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `autoscout24.${format}`);
    document.body.appendChild(link); 
    link.click();
}

const removeSpecialChars = (str:string) => {
    return str.replace(/(\r\n|\n|\r|,|;)/gm, " ")
}
// replace every value start with 'error' with dashs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const replaceErrorNotFoundWithDashs = (objData: any) => {
    for (const key in objData) {
        if (typeof objData[key] === 'string' && objData[key].startsWith('error')) {
            objData[key] = '- -';
        } else if (typeof objData[key] === 'object') {
            for (const innerKey in objData[key]) {
                if (typeof objData[key][innerKey] === 'string' && objData[key][innerKey].startsWith('error')) {
                    objData[key][innerKey] = '- -';
                }
            }
        }
    }
    return objData;
}

export const downloadProductasAsCsv = () => {
    const cars = getCars()
    if (!cars) return

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += 'Title;Model;Compnay;Vendor;Numbres;Address;Pro;AddressUrl;Url\n'
    cars.map((car) => {
        csvContent += `${removeSpecialChars(car.data.title)};${removeSpecialChars(car.data.model)};${removeSpecialChars(car.data.vendor_info.company)};${removeSpecialChars(car.data.vendor_info.name)};${Array.isArray(car.data.vendor_info.numbers) ? car.data.vendor_info.numbers.map(num => removeSpecialChars(num)).join('/') : removeSpecialChars(car.data.vendor_info.numbers)};${car.data.vendor_info.address.text.replace(/(\r\n|\n|\r|,|;)/gm, "-")};${car.data.vendor_info.pro ? "True":"False"};${car.data.vendor_info.address.url};${car.url}\n`;}).join('\n')
    downloadFile(csvContent,'csv')
}

export const downloadProductsAsJson = () => {
    const cars = getCars()
    if (!cars) return
    const jsonData = JSON.stringify({"Productas":cars},null,2);
    const dataStr = "data:text/json;charset=utf-8," + jsonData;
    downloadFile(dataStr,'json')
}