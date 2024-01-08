import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import '../styling/Homepage.css';

function getCurrentSong(accessToken, setCurrentSong, setCurrentPicture, setCurrentArtists) {
    axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log(response);
        setCurrentArtists(response.data.item.artists.map(artist => artist.name).join(', '));
        setCurrentSong(response.data.item.name);
        setCurrentPicture(response.data.item.album.images[0].url)
    }, error => {
        console.log(error);
    })
}

function getUsersTopTracks(accessToken, setTopTracks) {
    axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setTopTracks(response.data.items.slice(0, 5));
    }, error => {
        console.log(error);
    })
}

function getUsersTopArtists(accessToken, setTopArtists) {
    axios.get('https://api.spotify.com/v1/me/top/artists?time_range=short_term', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log(response);
        setTopArtists(response.data.items.slice(0, 10));
    }, error => {
        console.log(error);
    })
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function Homepage({ accessToken }) {
    const [userName, setUserName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [email, setEmail] = useState('');
    const [followers, setFollowers] = useState('');
    const [product, setProduct] = useState('');
    const [topTracks, setTopTracks] = useState([]);
    const [currentSong, setCurrentSong] = useState('');
    const [currentPicture, setCurrentPicture] = useState('');
    const [currentArtist, setCurrentArtists] = useState('');
    const [topArtists, setTopArtists] = useState([]);

    useEffect(() => {
        if (!accessToken) return;
        localStorage.setItem('accessToken', accessToken);

        axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setUserName(response.data.display_name);
            setEmail(response.data.email)
            setFollowers(response.data.followers.total)
            setProduct(capitalizeFirstLetter(response.data.product))

            if (response.data.images && response.data.images.length > 0) {
                setProfilePic(response.data.images[0].url);
            }
        }, error => {
            console.log(error);
        })
    }, [accessToken]);

    return (
        <div>
            <div className='homepage-wrapper'>
                <div className='user-wrapper'>
                    <div className='user-info'>
                        {profilePic && <img src={profilePic} alt='ProfilePicture' style={{ width: 100 }} />}
                        <p id='username'>{userName}</p>
                        <p className='sub-title'>{email}</p>
                        <p className='sub-title'>Followers: {followers}</p>
                        <p className='sub-title'>Product: {product}</p>
                    </div>

                    <div className='currently-playing-div'>
                        <button onClick={() => getCurrentSong(accessToken, setCurrentSong, setCurrentPicture, setCurrentArtists)}>Get Current Song</button>
                        <div className="current-song">
                            <img src={currentPicture} alt="Album Cover" style={{ width: 200, height: 200 }} />
                            <p>{currentSong}</p>
                            <p>{currentArtist}</p>
                        </div>
                    </div>

                </div>

                <div className='interactive-wrapper'>
                    <div className='header-interactive-section'>
                        <h1 className='interactive-header-title'>Explore Your Account</h1>
                    </div>

                    

                    <div className='tracks-artists-interactive-section'>
                        <div className="top-tracks">
                            <h2 id='interactive-sub-title'>Top Tracks</h2>
                            <ul>
                                {topTracks.map((track, index) => (
                                    <li className='tracks-list' key={index} style={{ animationDelay: `${index * 0.5}s` }}>
                                        <span style={{ marginRight: 10 }}>{index + 1}.</span>
                                        <img src={track.album.images[0].url} alt="Album Cover" style={{ width: 50, height: 50, marginRight: 10 }} />
                                        <span> - {track.name} by {track.artists.map(artist => artist.name).join(', ')}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className='centered-btn-div'>
                                <button onClick={() => getUsersTopTracks(accessToken, setTopTracks)}>Get Top Tracks</button>
                            </div>
                        </div>

                        <div className='top-artists'>
                            <h2 id='interactive-sub-title'>Top Artists</h2>
                            <ul>
                                {topArtists.map((artist, index) => (
                                    <li className='artists-list' key={index} style={{ animationDelay: `${index * 0.5}s` }}>
                                        <span style={{ marginRight: 10 }}>{index + 1}.</span>
                                        <img src={artist.images[0].url} alt="Artist Image" style={{ width: 50, height: 50, marginRight: 10 }} />
                                        <span> - {artist.name}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className='centered-btn-div'>
                                <button onClick={() => getUsersTopArtists(accessToken, setTopArtists)}>Get Top Artists</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Homepage;