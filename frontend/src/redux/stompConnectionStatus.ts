import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface InitialState {
    isConnected: boolean,
}

// Define the initial state using that type
const initialState: InitialState = {
    isConnected: false,
}

export const stompConnectionSlice = createSlice({
    name: 'stompConnectionStatus',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setStompConnected: (state) => {
            state.isConnected = true;
        },
        setStompDisconnected: (state) => {
            state.isConnected = false;
        },
    },
})

export const { setStompConnected, setStompDisconnected } = stompConnectionSlice.actions
