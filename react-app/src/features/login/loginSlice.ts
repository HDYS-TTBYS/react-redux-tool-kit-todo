import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from "axios";

const apiUrl = "http://localhost:8000/";
const token = localStorage.localJWT;

export const fetchAsyncLogin = createAsyncThunk("login/post", async (auth: Auth) => {
    const res = await axios.post(`${apiUrl}authen/jwt/create`, auth, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.data;
});

export const fetchAsyncRegister = createAsyncThunk("login/register", async (auth: Auth) => {
    const res = await axios.post(`${apiUrl}api/register/`, auth, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.data;
});

export const fetchAsyncProfile = createAsyncThunk("login/get", async () => {
    const res = await axios.get(`${apiUrl}api/myself/`, {
        headers: {
            Authorization: `JWT ${token}`,
        },
    });
    return res.data;
});

export type Auth = {
    username: string
    password: string
}

export interface LoginState {
    authen: Auth
    isLoginView: boolean
    profile: {
        id: number
        username: string
    }
}



const initialState: LoginState = {
    authen: {
        username: "",
        password: ""
    },
    isLoginView: true,
    profile: {
        id: 0,
        username: ""
    },
};

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        editUserName: (state, action: PayloadAction<string>) => {
            state.authen.username = action.payload;
        },

        editPassword: (state, action: PayloadAction<string>) => {
            state.authen.password = action.payload;
        },

        toggleMode: (state) => {
            state.isLoginView = !state.isLoginView;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
            //成功
            localStorage.setItem("localJWT", action.payload.access);
            action.payload.access && (window.location.href = "/tasks");
        });
        builder.addCase(fetchAsyncProfile.fulfilled, (state, action) => {
            //成功
            state.profile = action.payload;
        });
    }
});

export const { editUserName, editPassword, toggleMode } = loginSlice.actions;


export const selectAuthen = (state: RootState) => state.login.authen;
export const selectIsLoginView = (state: RootState) => state.login.isLoginView;
export const selectProfile = (state: RootState) => state.login.profile;

export default loginSlice.reducer;
