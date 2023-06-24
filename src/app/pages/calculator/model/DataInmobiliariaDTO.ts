export interface DataInmobiliariaDTO{
    apoyoHabitacional: string;
    cuotaInicial: number;
    entidadFinanciera: {
      nombreEntidad: string;
      plazo: number;
      segDesgravamen: number;
      segInmueble: number;
      tipoCapitalizacion: string;
      tipoTasa: string;
      tipoTasaNominal: string;
      valorTasa: number
    };
    moneda: string;
    perParcial: number;
    perTotal: number;
    sostenibilidad: string;
    totalBBP: number;
    username: string;
    valorInmueble: number
  }