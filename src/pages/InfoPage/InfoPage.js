import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import './InfoPage.scss';

export const InfoPage = ({ token }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then(res => res.json())
      .then(result => {
        if (result.users) {
          setUsers(result.users);
        } else {
          navigate('/login');
        }
      });
  }, []);

  const handleDelete = (userId) => {
    fetch(`http://localhost:5000/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => response.json())
      .then(result => {
        if (!result.message) {
          const newUsers = users.filter(user => user._id !== userId);
          setUsers(newUsers);

          if (!newUsers.length) {
            navigate('/login');
          }
        }
      });
  }

  const handleUpdate = (userId) => {
    navigate(`/login?mode=update&userId=${userId}`);
  }

  return (
    <div className="InfoPage">
      {users.map(user => (
        <div className="InfoPage__card" key={user._id}>
          <p className="card__username">
            {user.username}
          </p>

          <p className="card__field">
            {`Fullname: ${user.fullname}`}
          </p>

          <p className="card__field">
            {`Group: ${user.group}`}
          </p>

          <p className="card__field">
            {`Phone: ${user.phone}`}
          </p>

          <p className="card__field">
            {`Faculty: ${user.faculty}`}
          </p>

          <p className="card__field">
            {`City: ${user.city}`}
          </p>

          <button className="button" onClick={() => handleDelete(user._id)}>
            Delete
          </button>

          <button className="button" onClick={() => handleUpdate(user._id)}>
            Update
          </button>
        </div>
      ))}
    </div>
  );
}