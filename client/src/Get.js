import {useState,useEffect} from 'react'
import ListHeader from "./Components/ListHeader"
import ListItem from "./Components/ListItem"
import axiosInstance from "./utils/axiosInstance";

const Home = () => {
    const [tasks, setTasks] = useState([])
    const sortedTasks = tasks?.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    console.log('sortedTasks',sortedTasks)
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
    useEffect(()=>{
        getData()
        return ()=>{};
    },[])
    return (
        <>
            <ListHeader listName={"🏝️Holiday Tick List"} getData={getData} />
            {sortedTasks?.map((task)=><ListItem key={task.id} task={task} getData= {getData}/>)}
        </>
    )
}

export default Home