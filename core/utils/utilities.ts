import { DataInserction, TamanhoQuantidade } from "../interfaces";
import * as XLSX from 'xlsx';

export default function utilities(caminhoPlanilha: string = 'core/utils/distribuicao.xlsx'): DataInserction[] {
  const workbook = XLSX.readFile(caminhoPlanilha);
  const sheetName = workbook.SheetNames[0];

  // Carregar a planilha como uma matriz (Array<Array<any>>)
  const worksheet: any[][] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

  const dadosProcessados: DataInserction[] = [];

  // Garantir que temos uma linha de cabeçalho
  if (worksheet.length === 0) {
      return dadosProcessados; // Se a planilha estiver vazia, retorna um array vazio
  }

  // Identificar as colunas que contêm tamanhos (linha de cabeçalho)
  const headerRow = worksheet[0];

  // Percorrer cada linha da planilha, começando pela segunda (índice 1)
  for (let i = 1; i < worksheet.length; i++) {
      const linha = worksheet[i];

      const escola = linha[0];
      const projeto = linha[1];
      const item = linha[2];
      const genero = linha[3];

      const tamanhos: TamanhoQuantidade[] = [];

      // Processar as colunas de tamanhos a partir da quinta coluna
      for (let j = 4; j < linha.length; j++) {
          const quantidade = linha[j];
          const tamanho = headerRow[j]; // O valor do cabeçalho é o tamanho (ex: 2, 4, P, M, etc)

          // Verificar se a quantidade é um número válido, ou seja, maior que 0
          if (quantidade !== undefined && quantidade !== null && !isNaN(quantidade) && quantidade > 0) {
              tamanhos.push({
                  tamanho: tamanho.toString(),
                  quantidade: Number(quantidade)
              });
          }
      }

      // Só adicionar o registro se houver tamanhos válidos
      if (tamanhos.length > 0) {
          dadosProcessados.push({
              escola: escola,
              projeto: projeto,
              item: item,
              genero: genero,
              tamanhos: tamanhos // Apenas tamanhos válidos com quantidades
          });
      }
  }
  console.log(JSON.stringify(dadosProcessados, null, 2));
  return dadosProcessados;
}
