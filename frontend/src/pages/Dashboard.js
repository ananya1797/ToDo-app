import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  // 🔒 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  // 📥 Fetch all notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/note", {
        headers: { "auth-token": token }
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ➕ Add note
  const addNote = async () => {
    if (!form.title || !form.content) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/note", form, {
        headers: { "auth-token": token }
      });

      setForm({ title: "", content: "" });
      fetchNotes();
    } catch (err) {
      if (err.response?.status === 403) {
        alert("🚫 Free limit reached. Please upgrade to premium!");
      } else {
        alert("Error adding note");
  }
    }
  };

  // ❌ Delete note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${REACT_APP_BACKEND_URL}/api/note/${id}`, {
        headers: { "auth-token": token }
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔐 Protect route
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    } else {
      fetchNotes();
    }
  }, []);

  const handleUpgrade = async () => {
  try {
    const order = await axios.post(
      `${REACT_APP_BACKEND_URL}/api/payment/create-order`,
      {},
      { headers: { "auth-token": token } }
    );

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: order.data.amount,
      currency: "INR",
      order_id: order.data.id,

      handler: async function () {
        await axios.post(
          `${REACT_APP_BACKEND_URL}/api/payment/verify`,
          {},
          { headers: { "auth-token": token } }
        );

        alert("🎉 You are now a Premium User!");
        window.location.reload();
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="container mt-4">

      {/* 🔝 Top bar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>Your Notes</h2>
          <small className="text-muted">Welcome, {email}</small>
        </div>

        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ➕ Add Note Form */}
      <div className="card p-3 mb-4">
        <h5>Add New Note</h5>

        <input
          className="form-control mb-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <button className="btn btn-primary" onClick={addNote}>
          Add Note
        </button>
      </div>
      {notes.length > 3 && (
  <div className="alert alert-warning mt-3">
    🚫 You have reached free limit (3 notes).
    <br />
    <button className="btn btn-primary mt-2">
      Upgrade to Premium
    </button>
  </div>
)}

<button className="btn btn-warning mt-2" onClick={handleUpgrade}>
  Upgrade to Premium
</button>

      {/* 📄 Notes List */}
      <div className="row">
        {notes.length === 0 ? (
          <p className="text-muted">No notes yet. Add your first note!</p>
        ) : (
          notes.map((note) => (
            <div className="col-md-4" key={note._id}>
              <div className="card p-3 mb-3 shadow-sm">
                <h5>{note.title}</h5>
                <p>{note.content}</p>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteNote(note._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;