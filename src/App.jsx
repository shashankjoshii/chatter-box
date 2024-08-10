import React, { useEffect, useMemo, useState } from "react"; 
import { io } from "socket.io-client";
import { Container, TextField, Typography, Button, List, ListItem, ListItemText } from '@mui/material';

const App = () => {
    const socket = useMemo(() => io("http://localhost:3000"), []);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("message", { message });
        setMessage('');
    };

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connected", socket.id);
        });

        socket.on("recived message", (data) => {
            setMessages((prevMessages) => [...prevMessages, data.message]);
        });

        socket.on("welcome", (s) => {
            console.log(s);
        });
    }, [socket]);

    return (
        <Container maxWidth='sm'>
            <Typography variant="h2" component="div" gutterBottom>
                Chat
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    id="outlined-basic" 
                    label="Message" 
                    variant="outlined" 
                    fullWidth 
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                    Send
                </Button>
            </form>
            <List>
                {messages.map((msg, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={msg} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default App;
