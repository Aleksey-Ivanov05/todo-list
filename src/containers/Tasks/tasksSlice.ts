import {Task, TaskApi, TasksList} from "../../types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi";
import {RootState} from "../../app/store";


interface TasksState {
  items: Task[],
  fetchLoading: 'idle' | 'pending' | 'success' | 'failure';
  deleteLoading: boolean;
  createLoading: boolean;
}

interface UpdateTask {
  id: string;
  task: TaskApi;
}

const initialState: TasksState = {
  items: [],
  fetchLoading: 'idle',
  deleteLoading: false,
  createLoading: false,
}

export const fetchTasks = createAsyncThunk(
  'tasks/fetch',
  async () => {
    const tasksResponse = await axiosApi.get<TasksList | null>('tasks.json');
    const tasks = tasksResponse.data;
    let newTasks: Task[] = [];

    if (tasks) {
      newTasks = Object.keys(tasks).map(id => {
        const task = tasks[id];
        return {
          ...task,
          id
        }
      });
    }
    return newTasks;
  }
)

export const updateTask = createAsyncThunk<void, UpdateTask, {state: RootState}>(
  'tasks/update',
  async (task) => {
    const newTask = {
      ...task.task,
      done: !task.task.done
    }
    await axiosApi.put('tasks/' + task.id + '.json', newTask);
  }
);

export const deleteTask = createAsyncThunk<void, string>(
  'tasks/delete',
  async (id) => {
    await axiosApi.delete('tasks/' + id + '.json');
  }
)

export const newTask = createAsyncThunk<void, string>(
  'tasks/new',
  async (title) => {
    if (title) {
      const task = {
        title: title,
        done: false
      }
      await axiosApi.post('tasks.json', task);
    }
  }
)

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.fetchLoading = 'pending';
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.items = action.payload;
      state.fetchLoading = 'success';
    });
    builder.addCase(fetchTasks.rejected, (state) => {
      state.fetchLoading = 'failure';
    });
    builder.addCase(updateTask.pending, (state) => {
      state.fetchLoading = 'pending';
    });
    builder.addCase(updateTask.fulfilled, (state) => {
      state.fetchLoading = 'success';
    });
    builder.addCase(deleteTask.pending, (state) => {
      state.deleteLoading = true;
    });
    builder.addCase(deleteTask.fulfilled, (state) => {
      state.deleteLoading = false;
    });
    builder.addCase(deleteTask.rejected, (state) => {
      state.deleteLoading = false;
    });
    builder.addCase(newTask.pending, (state) => {
      state.createLoading = true;
    });
    builder.addCase(newTask.fulfilled, (state) => {
      state.createLoading = false;
    });
    builder.addCase(newTask.rejected, (state) => {
      state.createLoading = false;
    });
  }
});

export const tasksReducer = tasksSlice.reducer;
