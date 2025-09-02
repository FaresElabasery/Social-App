import { toast } from 'react-toastify';
import AddEditPost from '../../Components/AddEditPost/AddEditPost';
import PostCard from '../../Components/PostCard/PostCard';
import PostSkeleton from '../../Components/PostSkeleton/PostSkeleton';
import usePosts from '../../Hooks/usePosts';
import { ToastConfig } from '../../utils/ToastConfig';


export default function Posts() {
    const { data, isLoading, isError, error } = usePosts('allPosts')
    if (isLoading) {
        return <div className='w-full sm:w-10/12 lg:w-1/2 my-3 mx-auto px-4'>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
        </div>
    }
    if (isError) {
        toast.error(error?.message || 'Network Error', ToastConfig)
        return <div className='w-full sm:w-10/12 lg:w-1/2 my-3 mx-auto px-4'>
            <PostSkeleton />
        </div>
    }


    return (
        <main className='container'>
            <AddEditPost />
            {
                data?.posts.map(post => (
                    <div key={post._id} className='my-2'>
                        <PostCard post={post} />
                    </div>
                ))
            }
        </main>
    )
}
