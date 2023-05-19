import { createStore, combineReducers } from "redux"

import { chartsReducer } from "./charts"

import { composeWithDevTools } from "redux-devtools-extension"

export const rootReducer = combineReducers({
    chartsReducer
})

export type AppState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer,
  composeWithDevTools( )
)