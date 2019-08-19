const PROXY_CONFIG = [
    { 
      context: ['/api'],
      target: 'http://localhost:8000',
      secure: false, //como não é HTTPS
      logLevel: 'debug',
      pathRewrite: {'^/api' : ''}
    }
  ];
  module.exports = PROXY_CONFIG;

  /***
   * Tudo que não é rota, mas sim chamado ao Backend
   * será substituído por 'api' no código do projeto.
   * Por Exemplo.:
   * Se eu for fazer uma chamada para o backend NodeJS endereço.: 
   *            http://localhost:8000/upload
   *  Endereço alterando o context por conta da desabilitação do CORS.:     
   *            http://localhost:8000/api/upload
   *  Endereço com o 'pathRewrite': 
   *            http://localhost:8000/upload
   */