import { useState, useCallback } from "react";


// Colección de claves atómicas (ParamKey):

type ParamKey =
  | "Humedad"
  | "GranosVerdes"
  | "Impurezas"
  | "Vano"
  | "Hualcacho"
  | "GranosManchados"
  | "GranosPelados"
  | "GranosYesosos";

// 1) Define el tipo ParamCell (cada campo documentado):
interface ParamCell {
  key:
    | "price"
    | "grossWeight"
    | "tare"
    | "netWeight"
    | ParamKey
    | "ToleranceGroupResume"
    | "Resume"
    | "Bonus"
    | "Dry"
    | "totalDiscounts"
    | "totalPaddy"
    | "totalToPay";
  onGroup: boolean;      // Indica si participa en la tolerancia grupal

  keyPercent: number | null;
  keyTolerance: number | null;
  keyGroup: number | null;
  keyPenalty: number | null;
  keyTotal: number | null;

  setKeyPercent(v: number): void;
  setKeyTolerance(v: number): void;
  setKeyPenalty(v: number): void;
  setKeyTotal(v: number): void;
  setKeyGroup(v: number): void;

  getKeyPercent(): number | null;
  getKeyTolerance(): number | null;
  getKeyPenalty(): number | null;
  getKeyTotal(): number | null;

  setDefault(): void;
  reset(): void;

  // Dependencias para recálculo y notificación
  listenFor: string[];
  listenTo: string[];
}

// 2) Claves atómicas para iterar
const atomicParamKeys: ParamKey[] = [
  "Humedad",
  "GranosVerdes",
  "Impurezas",
  "Vano",
  "Hualcacho",
  "GranosManchados",
  "GranosPelados",
  "GranosYesosos",
];

// 3) Arreglo de ParamCell completamente tipado
const paramCells: ParamCell[] = [
  // — price (grupo 0) —
  {
    key: "price",
    onGroup: false,
    keyPercent: null,
    keyTolerance: null,
    keyGroup: null,
    keyPenalty: null,
    keyTotal: 0,

    setKeyPercent() {},
    setKeyTolerance() {},
    setKeyPenalty() {},
    setKeyTotal(v) { this.keyTotal = v; },
    setKeyGroup() {},

    getKeyPercent() { return this.keyPercent; },
    getKeyTolerance() { return this.keyTolerance; },
    getKeyPenalty() { return this.keyPenalty; },
    getKeyTotal() { return this.keyTotal; },

    setDefault() { this.keyTotal = 0; },
    reset() { this.keyTotal = 0; },

    listenFor: [],
    listenTo: ["totalToPay"],
  },

  // — grossWeight (grupo 0) —
  {
    key: "grossWeight",
    onGroup: false,
    keyPercent: null,
    keyTolerance: null,
    keyGroup: null,
    keyPenalty: null,
    keyTotal: 0,

    setKeyPercent() {},
    setKeyTolerance() {},
    setKeyPenalty() {},
    setKeyTotal(v) { this.keyTotal = v; },
    setKeyGroup() {},

    getKeyPercent() { return this.keyPercent; },
    getKeyTolerance() { return this.keyTolerance; },
    getKeyPenalty() { return this.keyPenalty; },
    getKeyTotal() { return this.keyTotal; },

    setDefault() { this.keyTotal = 0; },
    reset() { this.keyTotal = 0; },

    listenFor: [],
    listenTo: ["netWeight"],
  },

  // — tare (grupo 0) —
  {
    key: "tare",
    onGroup: false,
    keyPercent: null,
    keyTolerance: null,
    keyGroup: null,
    keyPenalty: null,
    keyTotal: 0,

    setKeyPercent() {},
    setKeyTolerance() {},
    setKeyPenalty() {},
    setKeyTotal(v) { this.keyTotal = v; },
    setKeyGroup() {},

    getKeyPercent() { return this.keyPercent; },
    getKeyTolerance() { return this.keyTolerance; },
    getKeyPenalty() { return this.keyPenalty; },
    getKeyTotal() { return this.keyTotal; },

    setDefault() { this.keyTotal = 0; },
    reset() { this.keyTotal = 0; },

    listenFor: [],
    listenTo: ["netWeight"],
  },

  // — netWeight (grupo 0) —
  {
    key: "netWeight",
    onGroup: false,
    keyPercent: null,
    keyTolerance: null,
    keyGroup: null,
    keyPenalty: null,
    keyTotal: 0,

    setKeyPercent() {},
    setKeyTolerance() {},
    setKeyPenalty() {},
    setKeyTotal(v) { this.keyTotal = v; },
    setKeyGroup() {},

    getKeyPercent() { return this.keyPercent; },
    getKeyTolerance() { return this.keyTolerance; },
    getKeyPenalty() { return this.keyPenalty; },
    getKeyTotal() { return this.keyTotal; },

    setDefault() { this.keyTotal = 0; },
    reset() { this.keyTotal = 0; },

    listenFor: ["grossWeight", "tare"],
    listenTo: [
      ...atomicParamKeys,
      "Bonus",
      "Dry",
      "ToleranceGroupResume",
      "Resume",
      "totalPaddy",
    ],
  },

  // — Parámetros atómicos (grupo 1) —
  ...atomicParamKeys.map<ParamCell>((k) => ({
    key: k,
    onGroup: false,
    keyPercent: 0,
    keyTolerance: 0,
    keyGroup: 0,
    keyPenalty: 0,
    keyTotal: 0,

    setKeyPercent(v) { this.keyPercent = v; },
    setKeyTolerance(v) { this.keyTolerance = v; },
    setKeyPenalty(v) { this.keyPenalty = v; },
    setKeyTotal() {},
    setKeyGroup(v) { this.keyGroup = v; },

    getKeyPercent() { return this.keyPercent; },
    getKeyTolerance() { return this.keyTolerance; },
    getKeyPenalty() { return this.keyPenalty; },
    getKeyTotal() { return this.keyTotal; },

    setDefault() {
      this.keyPercent = 0;
      this.keyTolerance = 0;
      this.keyPenalty = 0;
      this.keyTotal = 0;
      this.keyGroup = 0;
    },
    reset() {
      this.keyPercent = 0;
      this.keyTolerance = 0;
      this.keyPenalty = 0;
      this.keyTotal = 0;
      this.keyGroup = 0;
    },

    listenFor: [`percent${k}`, `tolerance${k}`, "netWeight"],
    listenTo: ["ToleranceGroupResume", "Resume"],
  })),

  // — Grupo de tolerancia (grupo 2) —
  {
    key: "ToleranceGroupResume",
    onGroup: true,
    keyPercent: 0,
    keyTolerance: 0,
    keyGroup: 2,
    keyPenalty: 0,
    keyTotal: null,

    setKeyPercent(v) { this.keyPercent = v; },
    setKeyTolerance(v) { this.keyTolerance = v; },
    setKeyPenalty(v) { this.keyPenalty = v; },
    setKeyTotal() {},
    setKeyGroup() {},

    getKeyPercent() { return this.keyPercent; },
    getKeyTolerance() { return this.keyTolerance; },
    getKeyPenalty() { return this.keyPenalty; },
    getKeyTotal() { return this.keyTotal; },

    setDefault() { this.keyPercent = 0; this.keyTolerance = 0; this.keyPenalty = 0; },
    reset() { this.keyPercent = 0; this.keyTolerance = 0; this.keyPenalty = 0; this.keyTotal = null; },

    listenFor: ["netWeight", ...atomicParamKeys],
    listenTo: ["Resume"],
  },

  // — Resume (total análisis) —
  {
    key: "Resume",
    onGroup: false,
    keyPercent: 0,
    keyTolerance: 0,
    keyGroup: null,
    keyPenalty: 0,
    keyTotal: null,

    setKeyPercent(v) { this.keyPercent = v; },
    setKeyTolerance(v) { this.keyTolerance = v; },
    setKeyPenalty(v) { this.keyPenalty = v; },
    setKeyTotal() {},
    setKeyGroup() {},

    getKeyPercent() { return this.keyPercent; },
    getKeyTolerance() { return this.keyTolerance; },
    getKeyPenalty() { return this.keyPenalty; },
    getKeyTotal() { return this.keyTotal; },

    setDefault() { this.keyPercent = 0; this.keyTolerance = 0; this.keyPenalty = 0; },
    reset() { this.keyTotal = null; },

    listenFor: [...atomicParamKeys, "ToleranceGroupResume"],
    listenTo: ["totalDiscounts"],
  },

  // — Bonus (bono secado) —
  {
    key: "Bonus",
    onGroup: false,
    keyPercent: null,
    keyTolerance: 0,
    keyGroup: null,
    keyPenalty: 0,
    keyTotal: null,

    setKeyPercent() {},
    setKeyTolerance(v) { this.keyTolerance = v; },
    setKeyPenalty(v) { this.keyPenalty = v; },
    setKeyTotal() {},
    setKeyGroup() {},

    getKeyPercent() { return this.keyPercent; },
    getKeyTolerance() { return this.keyTolerance; },
    getKeyPenalty() { return this.keyPenalty; },
    getKeyTotal() { return this.keyTotal; },

    setDefault() { this.keyTolerance = 0; this.keyPenalty = 0; },
    reset() { this.keyTolerance = 0; this.keyPenalty = 0; this.keyTotal = null; },

    listenFor: ["netWeight","toleranceBonus"],
    listenTo: ["totalPaddy"],
  },

  // — Dry (seco) —
  {
    key: "Dry",
    onGroup: false,
    keyPercent: 0,
    keyTolerance: null,
    keyGroup: null,
    keyPenalty: null,
    keyTotal: null,

    setKeyPercent(v) { this.keyPercent = v; },
    setKeyTolerance() {},
    setKeyPenalty() {},
    setKeyTotal() {},
    setKeyGroup() {},

    getKeyPercent() { return this.keyPercent; },
    getKeyTolerance() { return this.keyTolerance; },
    getKeyPenalty() { return this.keyPenalty; },
    getKeyTotal() { return this.keyTotal; },

    setDefault() { this.keyPercent = 0; },
    reset() { this.keyPercent = 0; this.keyTotal = null; },

    listenFor: [],
    listenTo: [],
  },

  // — totalDiscounts (grupo 5) —
  {
    key: "totalDiscounts",
    onGroup: false,
    keyPercent: null,
    keyTolerance: null,
    keyGroup: null,
    keyPenalty: null,
    keyTotal: 0,

    setKeyPercent() {},
    setKeyTolerance() {},
    setKeyPenalty() {},
    setKeyTotal(v) { this.keyTotal = v; },
    setKeyGroup() {},

    getKeyPercent() { return this.keyPercent; },
    getKeyTolerance() { return this.keyTolerance; },
    getKeyPenalty() { return this.keyPenalty; },
    getKeyTotal() { return this.keyTotal; },

    setDefault() { this.keyTotal = 0; },
    reset() { this.keyTotal = 0; },

    listenFor: ["Resume"],
    listenTo: ["totalPaddy"],
  },

  // — totalPaddy (grupo 5) —
  {
    key: "totalPaddy",
    onGroup: false,
    keyPercent: null,
    keyTolerance: null,
    keyGroup: null,
    keyPenalty: null,
    keyTotal: 0,

    setKeyPercent() {},
    setKeyTolerance() {},
    setKeyPenalty() {},
    setKeyTotal(v) { this.keyTotal = v; },
    setKeyGroup() {},

    getKeyPercent() { return this.keyPercent; },
    getKeyTolerance() { return this.keyTolerance; },
    getKeyPenalty() { return this.keyPenalty; },
    getKeyTotal() { return this.keyTotal; },

    setDefault() { this.keyTotal = 0; },
    reset() { this.keyTotal = 0; },

    listenFor: ["netWeight","totalDiscounts","Bonus"],
    listenTo: ["totalToPay"],
  },

  // — totalToPay (grupo 5) —
  {
    key: "totalToPay",
    onGroup: false,
    keyPercent: null,
    keyTolerance: null,
    keyGroup: null,
    keyPenalty: null,
    keyTotal: 0,

    setKeyPercent() {},
    setKeyTolerance() {},
    setKeyPenalty() {},
    setKeyTotal(v) { this.keyTotal = v; },
    setKeyGroup() {},

    getKeyPercent() { return this.keyPercent; },
    getKeyTolerance() { return this.keyTolerance; },
    getKeyPenalty() { return this.keyPenalty; },
    getKeyTotal() { return this.keyTotal; },

    setDefault() { this.keyTotal = 0; },
    reset() { this.keyTotal = 0; },

    listenFor: ["totalPaddy","price"],
    listenTo: [],
  },
];

// 4) Hook con método único y getters:
export function useParamCells() {
  const [cells] = useState<ParamCell[]>(paramCells);

  const updateParam = useCallback((key: ParamCell['key'], value: number) => {
    // TODO: lógica de actualización completa
  }, [cells]);

  const getParam = useCallback((key: ParamCell['key']) => {
    const cell = cells.find(c => c.key === key);
    return cell
      ? {
          percent: cell.getKeyPercent(),
          tolerance: cell.getKeyTolerance(),
          penalty: cell.getKeyPenalty(),
          total: cell.getKeyTotal(),
        }
      : null;
  }, [cells]);

  return { cells, updateParam, getParam };
}
