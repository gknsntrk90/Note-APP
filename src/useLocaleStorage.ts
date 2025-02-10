// CUSTOM HOOK
// react hooklarına benzer görev yapan ama kendi oluşturduğumuz hooklardır
// veri ve veriyi değiştirecek fonskyion dönerler

import { useEffect, useState } from "react";

export function useLocaleStorage<T>(
    key:string,
    initialValue:T | (() => T)
) {
    // State'i tanımlarız ve ilk değerini localestorageden alırız
    const [value, setValue] = useState<T>(() => {
// local'den saklanan değerleri al
const jsonValue = localStorage.getItem(key);


        if(jsonValue === null){
            // lokalde eleman yoksa başlangıç değerini belirler
            if(typeof initialValue === 'function'){
 // eğer başlangıç değeri fonksyonsa bu fonksyonun sonucunu kullanırız
                return(initialValue as () => T)();
            }else{
                // eğer fonskyon değilse değeri direktk kullanırız
                return initialValue
            }
        }else{
            // local'de blunursa bu değeri geri döndürmek
            return JSON.parse(jsonValue);
        }
    });



    // useeffect kullanarak value her değiştiğinde local'e kayderder
    useEffect(() => {
        localStorage.setItem(key,JSON.stringify(value))
    },[key,value]);

    // bileşenlere döndürülecek değer ve fonskyonu belirleme
    return [value,setValue] as [T, typeof setValue];
}