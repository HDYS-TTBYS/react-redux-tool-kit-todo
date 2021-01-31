import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from "axios";

const apiUrl = "http://localhost:8000/api/tasks/";
const token = localStorage.localJWT;

export type Task = {
    id: number
    title: string
    created_at?: string
    updated_at?: string
}

export interface TaskState {
    tasks: Task[]
    editedTask: Task
    selectedTask: Task
}

export const fetchAsyncGet = createAsyncThunk("tasks/get", async () => {
    const res = await axios.get(`${apiUrl}`, {
        headers: {
            Authorization: `JWT ${token}`,
        },
    });
    return res.data;
});

export const fetchAsyncCreate = createAsyncThunk("task/post", async (task: Task) => {
    const res = await axios.post(`${apiUrl}`, task, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
        },
    });
    return res.data;
});

export const fetchAsyncUpdate = createAsyncThunk("task/put", async (task: Task) => {
    const res = await axios.put(`${apiUrl}${task.id}/`, task, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
        },
    });
    return res.data;
});

export const fetchAsyncDelete = createAsyncThunk("task/delete", async (id: number) => {
    await axios.delete(`${apiUrl}${id}/`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
        },
    });
    return id;
});

const initialState: TaskState = {
    tasks: [
        {
            id: 0,
            title: "",
            created_at: "",
            updated_at: "",
        },
    ],
    editedTask: {
        id: 0,
        title: "",
        created_at: "",
        updated_at: "",
    },
    selectedTask: {
        id: 0,
        title: "",
        created_at: "",
        updated_at: "",
    },
};

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        editTask: (state, action: PayloadAction<Task>) => {
            state.editedTask = action.payload;
        },

        selectTask: (state, action: PayloadAction<Task>) => {
            state.selectedTask = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder.addCase(fetchAsyncGet.fulfilled, (state, action) => {
            //成功
            return {
                ...state,
                tasks: action.payload,
            };
        });
        builder.addCase(fetchAsyncCreate.fulfilled, (state, action) => {
            //成功
            return {
                ...state,
                tasks: [action.payload, ...state.tasks],
            };
        });
        builder.addCase(fetchAsyncUpdate.fulfilled, (state, action) => {
            //成功
            return {
                ...state,
                tasks: state.tasks.map((t) =>
                    t.id === action.payload.id ? action.payload : t
                ),
                selectedTask: action.payload,
            };
        });
        builder.addCase(fetchAsyncDelete.fulfilled, (state, action) => {
            //成功
            return {
                ...state,
                tasks: state.tasks.filter((t) =>
                    t.id !== action.payload
                ),
                selectedTask: { id: 0, title: "", created_at: "", updated_at: "" },
            };
        });

    }
});

export const { editTask, selectTask } = taskSlice.actions;


export const selectSelectedTask = (state: RootState) => state.task.selectedTask;
export const selectEditedTask = (state: RootState) => state.task.editedTask;
export const selectTasks = (state: RootState) => state.task.tasks;

export default taskSlice.reducer;
