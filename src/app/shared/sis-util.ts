
export abstract class SisUtil {

    constructor() {}
    
    static replaceStr(str: string): string {
        return str.replace('.', "").replace('.', "").replace("/", "").replace("-", "");
    }

    static formatCnpj(str: string): string {
        return str.substring(0,2)+"."+str.substring(2,5)+"."+str.substring(5,8)+"/"+str.substring(8,12)+"-"+str.substring(12,14);
    }

    /**
     * Generates protocol random numbers/symbols from seed
     * @param seed 
     */
    static gerarProtocolo(seed: string): string {
        let protocol = '';
        let index = 0;
        let max = seed.length;
        for( let i=0; i<8; i++ ) {
            index =Math.floor(Math.random() * (max - 0 + 1)) + 0;
            protocol += seed.substring(i, index).charCodeAt(seed.substring(i, index).length/2).toString(16).toUpperCase();
        }
        return protocol;
    }
}
