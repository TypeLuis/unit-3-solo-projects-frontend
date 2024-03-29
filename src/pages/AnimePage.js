import React from 'react'
import { UserContext } from "../context/UserContext"
import { useState, useContext, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import env from 'react-dotenv'
import watchFunction from '../Functions/WatchFunctions'
import faveFunctions from '../Functions/FaveFunctions'
import Carousel from 'react-bootstrap/Carousel'
import './AnimePage.scss'


const AnimePage = () => {

    const { pageState, watchState, faveState, userState } = useContext(UserContext)
    const [user, setUser] = userState
    const [pageId, setPageId] = pageState
    const [watched, setWatched] = watchState
    const [fave, setFave] = faveState

    const [watchIds, setWatchIds] = useState([])
    const [faveIds, setFaveIds] = useState([])

    const { id } = useParams()

    setPageId(id)

    const [response, setResponse] = useState({})

    const loadAnime = async () => {
        try {
            // setResponse({})

            const request = await axios.get(`https://api.jikan.moe/v4/anime/${id}`)

            // const response = await request.json()

            console.log(request.data.data)

            setResponse(request.data.data)

        }
        catch (error) {
            console.log(error)
        }


    }


    useEffect(() => {
        loadAnime()
    }, [id])


    useEffect(() => {
        watchFunction.fetchWatchedAnime(setWatchIds, setWatched)
    }, [])

    useEffect(() => { faveFunctions.fetchFaveAnime(setFaveIds, setFave) }, [])


    const animeId = response.mal_id
    const title = response.title
    const image = response.image_url


    return (
        <div>

            {user.id &&
                <div className='toggle-div'>

                    {watchFunction.checkWatched(watchIds, animeId) ?


                        <>
                            <span className="watchOutline" onClick={() => { watchFunction.deleteWatched(animeId, setWatchIds, setWatched); faveFunctions.deleteFave(animeId, setFaveIds, setFave) }}><span className='outline-text'>Watched</span> ✅</span>

                            {faveFunctions.checkFave(faveIds, animeId) ?

                                <span className="faveOutline" onClick={() => faveFunctions.deleteFave(animeId, setFaveIds, setFave)}><span className='outline-text'>Favored</span>❤️</span>

                                :

                                <span className="faveOutline" onClick={() => faveFunctions.faveAnime(animeId, image, title, setFaveIds, setFave)}><span className='outline-text'>Add to Favorite</span>♡</span>
                            }

                        </>
                        :
                        <span className="watchOutline" onClick={() => watchFunction.watchedAnime(animeId, image, title, setWatchIds, setWatched)}><span className='outline-text'>Watch</span>☑</span>

                    }

                </div>
            }

            {response &&


                <div className='anime-page'>

                    <div className='page-image-title'>

                        <a href={response.url}> <h1 className='page-title'>{response.title}</h1> </a>


                        <div className='page-image'>
                            <a href={`${response?.images?.jpg?.image_url}`}> <img src={response?.images?.jpg?.image_url} /> </a>
                        </div>

                    </div>


                    <Carousel>
                        <Carousel.Item>
                            <div className='page-synopsis'>
                                <p > <span>Synopsis: <br /></span> {response.synopsis}</p>
                            </div>

                        </Carousel.Item>
                        <Carousel.Item>
                            <div className='page-details'>
                                <div>

                                    <h1>Details</h1>
                                    <span className='page-score detail-name'> Score: <span className='detail-response'> {response.score}</span> <br /></span>

                                    <span className='detail-name'> premiered: <span className='detail-response'>  {response?.aired?.string}</span> <br /> </span>

                                    <span className='detail-name'>status: <span className='detail-response'>  {response.status}</span>  <br /> </span>

                                    <span className='detail-name'>rating: <span className='detail-response'>  {response.rating}</span> <br /> </span>

                                    <span className='detail-name'>broadcast: <span className='detail-response'> {response?.broadcast?.string}</span> <br /> </span>

                                    <span className='detail-name'>type: <span className='detail-response'>  {response.type}</span> <br /> </span>

                                </div>
                            </div>

                        </Carousel.Item>
                    </Carousel>





                    <div className='page-trailer'>
                        <h1>{response.title} Trailer:</h1>
                        <iframe src={response?.trailer?.embed_url}></iframe>
                    </div>

                </div>
            }


        </div>
    )
}

export default AnimePage

