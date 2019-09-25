
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

    /**
     * Return Files names separated by comma as String
     * @param res ResponseBody
     * @returns "F8Q-veFcv6prkORTASSYYbWY.png,U64MX8rws1558Fua3gMh-nvv.docx,pb6a_yaHrgDX319w0mLOmBHD.xlsx"
     */
    static formatFilesName(res: any){
        let dsNomeAnexo = "";
        if( res.names.hasOwnProperty('length') ){
          for( let i=0; i < res.names.length; i++ ){
            dsNomeAnexo = dsNomeAnexo.concat(res.names[i] + ",")
          }
          dsNomeAnexo = dsNomeAnexo.substring(0, dsNomeAnexo.length-1);
        } else{
          dsNomeAnexo = res.names;
        }
        return dsNomeAnexo;
    }
}
