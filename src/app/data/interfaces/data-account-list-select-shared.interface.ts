import { AccountModel } from "@data/models/business/account.model";

export interface IDataListAccountShared {
    component: string;
    heightContainerChild: number;
    flagShowComponentReceived: boolean;
    listaAccountReceived: AccountModel[];
}