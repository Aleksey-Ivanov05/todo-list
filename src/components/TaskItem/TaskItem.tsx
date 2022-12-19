import React from 'react';
import {Task} from "../../types";
import {useAppDispatch} from "../../app/hooks";
import {fetchTasks, updateTask} from "../../containers/Tasks/tasksSlice";
import './TaskItem.css';

interface Props {
  task: Task;
}

const TaskItem: React.FC<Props> = ({task}) => {
  const dispatch = useAppDispatch();
  let className = ' ';
  if (task.done) {
    className = ' Shadow';
  }
  // const deleteLoadingState = useAppSelector(state => state.tasks.deleteLoading);
  const onCheckboxChange = async () => {
    const newTask = {
      id: task.id,
      task: {
        title: task.title,
        done: task.done
      }
    }
    await dispatch(updateTask(newTask));
    await dispatch(fetchTasks());
  }

  // const onDelete = async () => {
  //   await dispatch(deleteTask(task.id));
  //   await dispatch(fetchTasks());
  // }

  return (
    <div className={"p-2 border border-dark border-2 mb-5 row" + className}>
      <p className="mb-2 fs-5 col-9"><strong>{task.title}</strong></p>
      <form className="col-1">
        <input className="form-check-input" type="checkbox" checked={task.done} onChange={onCheckboxChange}/>
      </form>
      {/*<button className="btn btn-danger col-2" onClick={onDelete} disabled={deleteLoadingState}>{deleteLoadingState && <ButtonSpinner/>} Delete</button>*/}
    </div>
  );
};

export default TaskItem;