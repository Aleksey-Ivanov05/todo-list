export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export type TaskApi = Omit<Task, 'id'>

export interface TasksList {
  [id: string]: TaskApi;
}