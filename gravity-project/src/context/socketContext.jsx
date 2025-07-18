// context/socketContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const newSocket = io('https://gravity-b434.onrender.com'); // Change to your backend URL
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('initialReviews', (data) => {
      setReviews(data);
    });

    newSocket.on('newReview', (newReview) => {
      setReviews((prev) => [...prev, newReview]);
    });

    newSocket.on('updatedReview', (updated) => {
      setReviews((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
    });

    newSocket.on('deletedReview', (deletedId) => {
      setReviews((prev) => prev.filter((r) => r._id !== deletedId));
    });

    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, reviews, setReviews }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);