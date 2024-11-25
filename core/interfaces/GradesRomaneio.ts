export default interface GradesRomaneio {
    id: number;
    isPrint: boolean;
    company: string;
    cnpjCompany: string;
    projectname: string;
    escola: string;
    numeroEscola: string;
    telefoneCompany: string;
    tipo: string | null;
    emailCompany: string;
    telefoneEscola: string;
    create: Date;
    enderecoschool: {
      rua: string;
      numero: string;
      complemento: string;
      bairro: string;
      cidade: string;
      estado: string;
      postalCode: string;
      country: string;
    };
    tamanhosQuantidades: {
      item: string;
      genero: string;
      tamanho: string;
      quantidade: number;
    }[];
    caixas: {
      caixaNumber: string;
      qtyCaixa: number;
      caixaItems: {
        itemName: string;
        itemGenero: string;
        itemTam: string;
        itemQty: number;
      }[];
    }[];
    enderecocompany: {
      rua: string;
      numero: string;
      complemento: string;
      bairro: string;
      cidade: string;
      estado: string;
      postalCode: string;
      country: string;
    };
  }
  