import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostCard from '../../Components/PostCard/PostCard';
import PostSkeleton from '../../Components/PostSkeleton/PostSkeleton';
import { AuthContext } from '../../Context/AuthContext/AuthContext';

export default function PostDetails() {
    const { id } = useParams()
    const { userToken: token, userInfo } = useContext(AuthContext)
    const navigate = useNavigate()

    function getPostDetails() {
        return axios(`${import.meta.env.VITE_BASE_URL}/posts/${id}`, {
            headers: {
                token
            }
        }).then(res => {
            return res.data.post;
        }).catch((error) => {
            console.log(error);
            navigate('/pageNotFound')
        })
    }

    const { data: postDetails } = useQuery({
        queryKey: ['postDetails', id],
        queryFn: getPostDetails,
        gcTime: 5 * 60 * 1000 // 5 mins
    })
    const isUserPost = useMemo(() => {
        return postDetails?.user?._id === userInfo?.user?._id;
    }, [postDetails, userInfo]);

    return (
        <main className='w-full sm:w-10/12 lg:w-1/2 my-3 mx-auto px-4 '>
            {postDetails && userInfo ? <PostCard post={postDetails} from='PostDetails' isUserPost={isUserPost} /> : <PostSkeleton />}
        </main>
    )
}
