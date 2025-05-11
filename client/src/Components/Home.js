import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import TickIcon from "./TickIcon";
import ProgressBar from "./ProgressBar";
import Auth from "./Auth";

const Home = ({listName}) => {
    const [showModal, setShowModal] = useState(false)
    const [tasks, setTasks] = useState([]);

    const getData = async () => {
        try {
            const response = await axiosInstance.get(`/get-all-notes`)
            if (response.data && response.data.notes) {
                console.log(response.data.notes)
                setTasks(response.data.notes);
            }
        } catch (error) {
            console.log("An unexpected error occurred. Please try again.");
        }
    }
    const deleteData = async () => {
        const noteId = tasks.id
        try {
            const response = await axiosInstance.delete(`/delete-note/` + noteId)
            if (response.data && !response.data.error) {
                console.log("Note Deleted Successfully", "delete");
                getData();
            }
        } catch (error) {

        }
    }
    const sortedTasks = tasks?.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

    useEffect(() => {
        console.log('useEffect triggered')
        getData();
        return () => { };
    }, []);

    const navigate = useNavigate();
    const signout = () => {
        localStorage.clear()
        navigate("/login");
    }
    return (
        <>
            <ListHeader>
                <div className="list-header">
                    <h1>{listName}</h1>
                    <div className="button-container">
                        <button className="create" onClick={() => setShowModal(true)}>ADD NEW</button>
                        <button className="signout" onClick={signout}>SIGN OUT</button>
                    </div>
                    {showModal && <Modal mode={"create"} setShowModal={setShowModal} getData={getData} />}
                    {showModal && <Auth getData={getData} />}
                </div>
            </ListHeader>
            <ListItem>
                <li className="list-item">
                    <div className="info-container">
                        <TickIcon />
                        <p className="task-title">{tasks.title}</p>
                        <ProgressBar />
                    </div>

                    <div className="button-container">
                        <button className="edit" onClick={() => setShowModal(true)}>Edit</button>
                        <button className="delete" onClick={deleteData}>Delete</button>
                    </div>
                    {showModal && <Modal mode={"edit"} setShowModal={setShowModal} task={tasks} getData={getData} />}
                </li>{showModal && <Auth getData={getData} />}
            </ListItem>

        </>
    );

}

export default Home
