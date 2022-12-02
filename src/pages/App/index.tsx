import React, { useState, useEffect } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import YoutubeEmbed from './YoutubeEmbed/YoutubeEmbed';
import getYouTubeID from 'get-youtube-id';
import styles from './Sala.module.scss';

export default function Sala() {

    const [link, setLink] = useState('');
    const [idVideo, setIdVideo] = useState<string | null>('');
    const [nameRoom, setNameRoom] = useState('');

    const params = useParams();
    const API = 'https://desafio-erural-json-server.vercel.app/salas';
    const navigate = useNavigate();

    function handleSubmit(e: any) {
        e.preventDefault();
        handleSetYoutubeId(link);
        handleUpdateLinkVideo();
    }

    function handleSetYoutubeId(newLink: any) {
        if (newLink == '') {
            setIdVideo('');
        } else {
            const ytId = getYouTubeID(newLink, { fuzzy: false });
            setIdVideo(ytId);
        }
    }

    async function handleUpdateLinkVideo() {

        const updateOptions = {
            method: 'PATCH',
            body: JSON.stringify({ link: link }),
            headers: {
                'Content-Type': 'application/json'
            },
        };

        const reqUrl = `${API}/${params.id}`;
        const response = await fetch(reqUrl, updateOptions);
        console.log(response, 'oi');
        return response;

    }

    async function getLinkVideo() {

        await fetch(`${API}/${params.id}`).then((response) => {
            return response.json();
        })
            .then((data) => {
                if (data == null) {
                    console.log(data);
                    return idVideo;
                }

                const selectedRoom = data;

                setTimeout(() => {
                    setLink(selectedRoom.link);
                    handleSetYoutubeId(selectedRoom.link);
                    setNameRoom(selectedRoom.room);
                }, 200);
                console.log(selectedRoom.link);
            });

    }

    /**
 * Esse useEffect só irá ser executado quando o usuário entrar na sala.
 * 
 */
    useEffect(() => {
        getLinkVideo();
    }, []);

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Nav >
                        <Nav.Link style={{ color: 'white' }} onClick={() => navigate('/')}>Home</Nav.Link>
                        <Nav.Link style={{ color: 'white' }} onClick={() => window.location.reload()}>Atualizar</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <div className={styles.container}>
                <h1>Sala: {nameRoom}</h1>
                <h1 >eRural</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="insertVideo"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className={styles.buscador}
                        placeholder='Insira um link do youtube!'
                    />
                    <button
                        type="submit"
                        className={styles.button}><HiMagnifyingGlass size={25}
                        />
                    </button>
                </form>

            </div>
            {link == '' ? <div className={styles.noVideo}>Sala sem video</div> :
                <YoutubeEmbed
                    embedId={idVideo === '' ? '' : idVideo}
                />}
        </>
    );
}
