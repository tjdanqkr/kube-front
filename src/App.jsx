import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [boards, setBoards] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const title = e.target.elements[0].value;
    const content = e.target.elements[1].value;
    const res = await axios.post(`/api/v1/demo1`, { title, content });

    if (res.status !== 201) {
      return;
    }
    setBoards([...boards, res.data]);
  };
  const getBoards = async () => {
    const res = await axios.get(`/api/v1/demo1`);

    if (res.status === 200 && Array.isArray(res.data)) {
      setBoards(res.data);
    }
  };
  useEffect(() => {
    getBoards();
  }, []);
  const open = async (id) => {
    const board = boards.find((b) => b.id === id);
    const res = await axios.get(`/api/v1/demo2/${id}`);
    if (res.status === 200 && Array.isArray(res.data)) {
      board.comments = res.data;
      board.open = !board.open;
      setBoards([...boards]);
    }
  };
  const saveComment = async (e, board) => {
    e.preventDefault();
    const res = await axios.post(`/api/v1/demo2`, { content: e.target.elements[0].value, boardId: board.id });

    if (res.status !== 201) {
      return;
    }
  };
  return (
    <div>
      <h1>Boards</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="title"></input>
        <input placeholder="content"></input>
        <button>Add</button>
      </form>
      <ul>
        {boards.map((board) => (
          <React.Fragment key={board.id}>
            <li>{board.title}</li>
            <li>{board.content}</li>
            {/* comment  */}
            <form onSubmit={(e) => saveComment(e, board)}>
              <input placeholder="comment"></input>
              <button>Comment</button>
            </form>
            <button onClick={() => open(board.id)}>open</button>
            {board.open && (
              <ul>
                {board.comments.map((comment) => (
                  <li key={comment.id}>{comment.content}</li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default App;
