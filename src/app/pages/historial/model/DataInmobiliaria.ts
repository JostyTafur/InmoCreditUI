export interface DataInmobiliaria{
    apoyoHabitacional: string;
    cuotaInicial: number;
    entidadFinanciera: {
        id: number;
        nombreEntidad: string;
        plazo: number;
        segDesgravamen: number;
        segInmueble: number;
        tipoCapitalizacion: string;
        tipoTasa: string;
        tipoTasaNominal: string;
        valorTasa: number
    };
    id: number;
    moneda: string;
    perParcial: number;
    perTotal: number;
    sostenibilidad: string;
    totalBBP: number;
    user: {
        email: string;
        id: number;
        name: string;
        password: string;
        roles: [
            {
                id: number;
                roleName: string;
            }
        ];
        userName: string;
    };
    valorInmueble: number;
}