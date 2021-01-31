import React from 'react'
import { Task } from './taskSlice'
import styles from "./TaskItem.module.css";

import { BsTrash } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import { fetchAsyncDelete, selectTask, editTask, selectEditedTask } from "./taskSlice";

const TaskItem = ({ task }: { task: Task }) => {
    const dispatch = useDispatch();
    const editedTask = useSelector(selectEditedTask);

    return (
        <li className={styles.listItem}>
            <span
                className={styles.cursor}
                onClick={() => dispatch(selectTask(task))}
            >
                {task.title}
            </span>
            <div>
                <button
                    className={styles.taskIcon}
                    onClick={() => dispatch(fetchAsyncDelete(task.id))}
                >
                    <BsTrash />
                </button>
                <button
                    className={styles.taskIcon}
                    onClick={editedTask.id === 0 ?
                        () => dispatch(editTask(task))
                        :
                        () => dispatch(editTask({ id: 0, title: "" }))}
                >
                    <FaEdit />
                </button>
            </div>
        </li>
    )
}

export default TaskItem
