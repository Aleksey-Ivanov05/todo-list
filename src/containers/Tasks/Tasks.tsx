import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchTasks, newTask} from "./tasksSlice";
import Spinner from "../../components/Spinner/Spinner";
import TaskItem from "../../components/TaskItem/TaskItem";
import ButtonSpinner from "../../components/Spinner/ButtonSpinner";

const Tasks = () => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState('');
  const tasks = useAppSelector(state => state.tasks.items);
  const loadingState = useAppSelector(state => state.tasks.fetchLoading);
  const createLoadingState = useAppSelector(state => state.tasks.createLoading);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;

    setInputValue(value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(newTask(inputValue));
    await dispatch(fetchTasks());
    setInputValue('');
  }

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch])


  return (
    <>
      <div className="navbar navbar-expand-sm navbar-dark bg-primary mb-3">
        <div className="container">
          <span className="navbar-brand">Tasks</span>
        </div>
      </div>
      <div className="container">
        <form onSubmit={onSubmit}>
          <div className="input-group mb-3">
            <input type="text" className="form-control form-control-lg" placeholder="Enter your task" value={inputValue} onChange={onInputChange}/>
            <button className="btn btn-primary" type="submit" disabled={createLoadingState}>{createLoadingState && <ButtonSpinner/>}Add</button>
          </div>
        </form>
        <div className="mt-5">
          {loadingState === "pending" ? <Spinner/> : tasks.map((task) => (
            <TaskItem key={task.id} task={task}/>
          ))}
        </div>
      </div>
    </>
  );
};

export default Tasks;