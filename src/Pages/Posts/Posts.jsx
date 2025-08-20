import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import PostSkeleton from '../../Components/PostSkeleton/PostSkeleton';
import PostCard from '../../Components/PostCard/PostCard';
import { AuthContext } from './../../Context/AuthContext/AuthContext';
import AddEditPost from '../../Components/AddEditPost/AddEditPost';

export default function Posts() {
    const { userToken: token } = useContext(AuthContext)
    const [ShowInput, setShowInput] = useState(false)
    const [allPost, setAllPost] = useState([])
    function getAllPosts() {
        axios(`${import.meta.env.VITE_BASE_URL}/posts`, {
            params: {
                limit: 10,
                page: 1
            },
            headers: {
                token
            }

        }).then((res) => {
            if (res.data.message === "success") {
                setAllPost(res.data.posts)
                console.log(res.data.posts)
            }
        }).catch((error) => {
            return console.log(error);
        })
    }
    useEffect(() => {
        getAllPosts()
    }, [])

    return (
        <main className='w-full sm:w-10/12 lg:w-1/2 my-3 mx-auto px-4'>
            <AddEditPost ShowInput={ShowInput} setShowInput={setShowInput} />
            {allPost.length > 0 ?
                allPost.map(post => (
                    <div key={post._id}>
                        <PostCard post={post} />
                    </div>
                ))
                :
                <>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </>
            }
        </main>
    )
}
