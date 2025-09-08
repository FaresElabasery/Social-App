import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useInView } from 'framer-motion';
import { useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import AddEditPost from '../../Components/AddEditPost/AddEditPost';
import PostCard from '../../Components/PostCard/PostCard';
import PostSkeleton from '../../Components/PostSkeleton/PostSkeleton';
import { AuthContext } from '../../Context/AuthContext/AuthContext';
import { ToastConfig } from '../../utils/ToastConfig';

export default function Posts() {
    const ref = useRef(null)
    const inView = useInView(ref)
    const { userToken, userInfo } = useContext(AuthContext)
    const getAllPost = async ({ pageParam }) => {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts?sort=-createdAt&page=${pageParam}`, {
            headers: {
                token: userToken
            }
        })
        return response.data
    }
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['allPosts'],
        queryFn: getAllPost,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.paginationInfo.nextPage <= lastPage.paginationInfo.numberOfPages ? lastPage.paginationInfo.nextPage : undefined,
        staleTime: 8 * 1000, // 8 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!userToken && !!userInfo
    })

    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [inView, fetchNextPage])


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
        <main className='container'>
            <AddEditPost />
            {
                data.pages.map((page) => (
                    <>
                        {
                            page?.posts.map(post => (
                                <div key={post._id} className='my-2'>
                                    <PostCard post={post} />
                                </div>
                            ))
                        }
                    </>
                ))
            }
            < div ref={ref}>
                {isFetchingNextPage
                    ? <PostSkeleton />
                    : !hasNextPage && <div className='text-center text-default-400'>Nothing more to load</div>
                }
            </div>
        </main >
    )
}
