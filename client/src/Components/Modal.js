import { useState } from 'react'
import axiosInstance from '../utils/axiosInstance';

const Modal = ({ mode, setShowModal, getData, task }) => {
  // const mode = 'create'
  const editMode = mode === 'edit' ? true : false;

  const [data, setData] = useState({
    title: editMode ? task.title : null,
    process: editMode ? task.progress : 50,
    date: editMode ? task.date : new Date()
  })

  //To post a data(todo)
  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/add-note', { ...data })
      if (response.data && response.data.note) 
        console.log('Task added')
        setShowModal(false)
        getData()
      
    }
    catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
      } else {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  }

  //To edit a data(Todo)
  const editData = async (e) => {
    e.preventDefault()
    const noteId = task.id
    try {
      const response = await axiosInstance.put(`/edit-note/` + noteId, {...data})
      console.log(response)
      if (response.data && response.data.note) 
        console.log('Task updated')
        setShowModal(false)
        getData()
      
    }
    catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
      } else {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  }

  const handleChange = (e) => {
    // const {name, value} = e.target;
    setData(data => ({
      //destructure data and update the value of the key which is name
      ...data, // Using Spread Operator so that all exisiting properties if Data are retained
      [e.target.name]: e.target.value
      //either can be written in the below format also:
      // [name]:value
    }))
    console.log(data)
  }

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>
        <form>
          <input
            required
            maxLength={30}
            placeholder="Your task goes here"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br />
          <label for="range">Drag to select your current progress</label>
          <input
            required
            type="range"
            id="range"
            min="0"
            max="100"
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />
          <input className={mode} type="submit" onClick={editMode ? editData : postData} />
        </form>
      </div>
    </div>
  );
}

export default Modal;