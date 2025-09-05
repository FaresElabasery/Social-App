import { toast } from 'react-toastify';
import AddEditPost from '../../Components/AddEditPost/AddEditPost';
import PostCard from '../../Components/PostCard/PostCard';
import PostSkeleton from '../../Components/PostSkeleton/PostSkeleton';
import usePosts from '../../Hooks/usePosts';
import { ToastConfig } from '../../utils/ToastConfig';
import { useInView } from 'framer-motion';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../Context/AuthContext/AuthContext';


export default function Posts() {
    const { userToken } = useContext(AuthContext)
    const ref = useRef(null)
    const inView = useInView(ref)
    const {
        status,
        data,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage, } = useInfiniteQuery({
            queryKey: ['allPosts'],
            queryFn: async function ({ pageParam = 1 }) {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts?sort=-createdAt&page=${pageParam}`, {
                    headers: {
                        token: userToken
                    }
                })
                return res.data
            },
            getNextPageParam: (lastPage) => lastPage.paginationInfo.nextPage <= lastPage.paginationInfo.numberOfPages ? lastPage.paginationInfo.nextPage : undefined,
        })

    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [fetchNextPage, inView])

    // const { data, isLoading, isError, error } = usePosts('allPosts')
    if (status == 'pending') {
        return <div className='w-full sm:w-10/12 lg:w-1/2 my-3 mx-auto px-4'>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
        </div>
    }
    if (status == 'error') {
        toast.error(error?.message || 'Network Error', ToastConfig)
        return <div className='w-full sm:w-10/12 lg:w-1/2 my-3 mx-auto px-4'>
            <PostSkeleton />
        </div>
    }

    return (
        <main className="container">
            <AddEditPost />
            {data.pages.map((page) =>
                page?.posts.map((post) => (
                    <div key={post._id} className="my-2">
                        <PostCard post={post} />
                    </div>
                ))
            )}

            <div ref={ref}>
                <PostSkeleton />
                {!hasNextPage && (
                    <p className="text-center text-gray-400 py-4">
                        Nothing more to load
                    </p>
                )}
            </div>
        </main>
    )
}
