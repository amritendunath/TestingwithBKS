import { useState } from "react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

const ListHeader = ({ listName, getData }) => {
  const [showModal, setShowModal] = useState(null);

  const navigate = useNavigate();
  const signout = () => {
    localStorage.clear()
    navigate("/login");
  }

  return (
    <div className="list-header">
      <h1>{listName}</h1>
      <div className="button-container">
        <button className="create" onClick={() => setShowModal(true)}>ADD NEW</button>
        <button className="signout" onClick={signout}>SIGN OUT</button>
      </div>
      {showModal && <Modal mode={"create"} setShowModal={setShowModal} getData={getData} />}
    </div>
  );
}

export default ListHeader;