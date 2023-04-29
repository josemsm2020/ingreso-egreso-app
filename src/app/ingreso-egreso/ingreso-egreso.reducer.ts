import { IngresoEgreso } from './../models/ingreso-egreso.model';
import { createReducer, on } from '@ngrx/store';
import { setItems, unSetItems } from './ingreso-egreso.actions';

export interface State { items: IngresoEgreso[]; }
export const initialState: State = { items: []};

export const ingresoEgresoReducer = createReducer(
  initialState,
  on( setItems, (state, { items }) => ({ ...state, items: [...items] })),
  on( unSetItems, state => ({ ...state, items: [] }))
);