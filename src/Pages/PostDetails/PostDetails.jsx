import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostSkeleton from '../../Components/PostSkeleton/PostSkeleton';
import PostCard from '../../Components/PostCard/PostCard';
import { AuthContext } from '../../Context/AuthContext/AuthContext';

export default function PostDetails() {
    const { id } = useParams()
    const { userToken: token } = useContext(AuthContext)
    const [postDetails, setPostDetails] = useState(null)
    const navigate = useNavigate()

    function getPostDetails() {
        axios(`${import.meta.env.VITE_BASE_URL}/posts/${id}`, {
            headers: {
                token
            }
        }).then(res => {
            setPostDetails(res.data.post);
        }).catch(error => {
            console.log(error);
            navigate('/pageNotFound')
        })
    }
    useEffect(() => {
        getPostDetails()
    }, [])

    return (
        <main className='w-full sm:w-10/12 lg:w-1/2 my-3 mx-auto px-4 '>
            {postDetails ? <PostCard post={postDetails} from='PostDetails' /> : <PostSkeleton />}
        </main>
    )
}
