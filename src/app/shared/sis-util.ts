
export abstract class SisUtil {

    constructor() {}
    
    static replaceStr(str: string): string {
        return str.replace('.', "").replace('.', "").replace("/", "").replace("-", "");
    }

    static formatCnpj(str: string): string {
        return str.substring(0,2)+"."+str.substring(2,5)+"."+str.substring(5,8)+"/"+str.substring(8,12)+"-"+str.substring(12,14);
      }
}