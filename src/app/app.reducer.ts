import { ActionReducerMap } from "@ngrx/store";
import * as ui from './shared/ui.reducer';
import * as auth from './auth/auth.reducer';

export interface AppState {
    ui: ui.State,
    user: auth.State
}

export const appReducers: ActionReducerMap<AppState> = {
    ui: ui.uiReducer, //No estoy ejecutando la función, estoy haciendo referencia a la misma
    user: auth.authReducer
}

 