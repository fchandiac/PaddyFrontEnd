export interface Producer {
  id: number;
  name: string;
  businessName: string;
  rut: string;
  address: string;
  phone: string;
  createdAt: string; // o Date si ya lo estás tratando como objeto de fecha
}

export type CreateProducerDto = Omit<Producer, "id" | "createdAt">;

export type UpdateProducerDto = Partial<CreateProducerDto>;

const banks = [
  {
    codigo: "001",
    nombre: "Banco de Chile",
    marcas: ["Banco Edwards | Citi", "Atlas", "CrediChile"],
  },
  {
    codigo: "009",
    nombre: "Banco Internacional",
    marcas: [],
  },
  {
    codigo: "014",
    nombre: "Scotiabank Chile",
    marcas: ["Banco del Desarrollo"],
  },
  {
    codigo: "016",
    nombre: "Banco de Crédito e Inversiones (BCI)",
    marcas: ["TBanc", "Banco Nova"],
  },
  {
    codigo: "028",
    nombre: "Banco BICE",
    marcas: [],
  },
  {
    codigo: "031",
    nombre: "HSBC Bank (Chile)",
    marcas: [],
  },
  {
    codigo: "037",
    nombre: "Banco Santander-Chile",
    marcas: ["Banefe"],
  },
  {
    codigo: "039",
    nombre: "Banco Itaú Chile",
    marcas: [],
  },
  {
    codigo: "049",
    nombre: "Banco Security",
    marcas: [],
  },
  {
    codigo: "051",
    nombre: "Banco Falabella",
    marcas: [],
  },
  {
    codigo: "053",
    nombre: "Banco Ripley",
    marcas: [],
  },
  {
    codigo: "055",
    nombre: "Banco Consorcio",
    marcas: [],
  },
  {
    codigo: "504",
    nombre: "Scotiabank Azul",
    marcas: ["ex Banco Bilbao Vizcaya Argentaria, Chile (BBVA)"],
  },
  {
    codigo: "059",
    nombre: "Banco BTG Pactual Chile",
    marcas: [],
  },
  {
    codigo: "062",
    nombre: "Tanner Banco Digital",
    marcas: [],
  },
  {
    codigo: "012",
    nombre: "Banco del Estado de Chile (BancoEstado)",
    marcas: [],
  },
];


export const bankOptions = [
  {
    name: "Banco BICE",
  },
  {
    name: "Banco BTG Pactual Chile",
  },
  {
    name: "Banco Consorcio",
  },
  {
    name: "Banco de Chile / Banco Edwards | Citi / Atlas / CrediChile",
  },
  {
    name: "Banco de Crédito e Inversiones (BCI) / TBanc / Banco Nova",
  },
  {
    name: "Banco del Estado de Chile (BancoEstado)",
  },
  {
    name: "Banco Falabella",
  },
  {
    name: "Banco Internacional",
  },
  {
    name: "Banco Itaú Chile",
  },
  {
    name: "Banco Ripley",
  },
  {
    name: "Banco Santander-Chile / Banefe",
  },
  {
    name: "Banco Security",
  },
  {
    name: "HSBC Bank (Chile)",
  },
  {
    name: "Scotiabank Azul / ex Banco Bilbao Vizcaya Argentaria, Chile (BBVA)",
  },
  {
    name: "Scotiabank Chile / Banco del Desarrollo",
  },
  {
    name: "Tanner Banco Digital",
  }
];



export const accountBankTypes = [
  { type: "Cuenta Corriente" },
  { type: "Cuenta Vista" },
  { type: "Cuenta de Ahorro" },
  { type: "CuentaRUT" },
  { type: "Cuenta Empresa / PyME" }
];


