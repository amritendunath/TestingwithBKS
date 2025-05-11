import { useState } from "react";
import TickIcon from "./TickIcon";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";
import axiosInstance from "../utils/axiosInstance";

const ListItem = ({ task, getData }) => {
    const [showModal, setShowModal] = useState(false);
    const deleteData = async () => {
        const noteId = task.id
        try {
            const response = await axiosInstance.delete(`/delete-note/` + noteId)
            if (response.data && !response.data.error) {
                console.log("Note Deleted Successfully", "delete");
                getData();
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <li className="list-item">
            <div className="info-container">
                <TickIcon />
                <p className="task-title">{task.title}</p>
                <ProgressBar />
            </div>

            <div className="button-container">
                <button className="edit" onClick={() => setShowModal(true)}>Edit</button>
                <button className="delete" onClick={deleteData}>Delete</button>
            </div>
            {showModal && <Modal mode={"edit"} setShowModal={setShowModal} task={task} getData={getData} />}
        </li>
    );
}

export default ListItem;