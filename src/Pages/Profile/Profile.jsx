import { Avatar, Chip, useDisclosure } from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { LiaSortAmountDownSolid, LiaSortAmountUpAltSolid } from "react-icons/lia";
import { MdModeEditOutline } from "react-icons/md";
import { toast } from "react-toastify";
import ProfilePhotoModal from "../../Components/ProfilePhotoModal/ProfilePhotoModal";
import ProfileCardSkeleton from "../../Components/ProfileCardSkeleton/ProfileCardSkeleton";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import usePosts from "../../Hooks/usePosts";
import useUpdate from "../../Hooks/useUpdate";
import { ToastConfig } from "../../utils/ToastConfig";
import PostCard from './../../Components/PostCard/PostCard';
import ProfileSkeleton from './../../Components/ProfileSkeleton/ProfileSkeleton';

export default function Profile() {
    const { userInfo, isUserInfoLoading } = useContext(AuthContext)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [image, setImage] = useState(null)


    // get user Posts
    const { data: userPosts, isPending: isUserPostsLoading, isError: isUserPostsError } = usePosts(['userPosts', userInfo?.user?._id])

    // make States for sorted posts
    const [issortPosts, setIsSortPosts] = useState(true)
    const [sortedUserPosts, setsortedUserPosts] = useState([])

    // get user posts lenght
    const userPostsCount = userPosts?.posts?.length || 0

    // sort the post by date
    const handleSortedPosts = () => {
        if (issortPosts) {
            setsortedUserPosts((prev) => [...prev]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
            setIsSortPosts(false)
        }
        else {
            setsortedUserPosts((prev) => [...prev]?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)))
            setIsSortPosts(true)
        }
    }

    // validate the image 
    const handleChangeProfilePicture = (e) => {
        let file = e.target.files[0];
        if (file && file.size > 1024 * 1024) {
            toast.error('Please upload a file less than 1MB', ToastConfig)
            setImage(null)
        } else if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
            toast.error('Please upload a valid image', ToastConfig)
            setImage(null)
        }
        else {
            setImage(file)
        }
    }

    // reset the image field
    const resetImage = () => {
        setImage(null)
        onClose()
    }
    // upload Profile Picture of user
    const { mutate: uploadProfilePicture, isPending: isUploading } = useUpdate('uploadProfilePicture', image, resetImage)

    if (isUserPostsError) {
        toast.error('Error for Getting Posts', ToastConfig)
    }
    useEffect(() => {
        if (userPosts?.posts) {
            setsortedUserPosts(userPosts.posts)
        }
    }, [userPosts])

    return (
        <div className='h-screen flex flex-col '>
            <div className="container">
                <div className='flex flex-col items-center justify-center gap-2 '>
                    {
                        isUserInfoLoading ? <ProfileSkeleton /> : <>
                            <div className="relative">
                                <Avatar
                                    isBordered
                                    radius="full"
                                    className="size-32 "
                                    src={userInfo?.user?.photo}
                                    alt={userInfo?.user?.name}
                                    color="primary"
                                    classNames={{
                                        img: "object-cover object-top",
                                    }}
                                />

                                <input
                                    type="file"
                                    className="hidden"
                                    id='upload'
                                    accept="image/jpeg, image/png, image/jpg"
                                    onChange={handleChangeProfilePicture}
                                />
                                <ProfilePhotoModal isOpen={isOpen} onClose={onClose} resetImage={resetImage} userInfo={userInfo} image={image} setImage={setImage} uploadProfilePicture={uploadProfilePicture} isUploading={isUploading} />
                                <label htmlFor="upload" className=' flex items-center justify-center'>
                                    <span onClick={onOpen} className="absolute bg-white border-2 hover:bg-primary hover:text-white duration-250 group  shadow-lg  text-primary size-7 rounded-full flex-center bottom-2 right-2 cursor-pointer">
                                        <MdModeEditOutline className="group-hover:scale-120 duration-250" size={15} />
                                    </span>
                                </label>
                            </div>
                            <h1 className='text-3xl font-bold'>{userInfo?.user?.name}</h1>
                            <ul className='flex flex-col items-center justify-center gap-2 text-secondary'>
                                <li >{userInfo?.user?.email}</li>
                                <li>{userInfo?.user?.dateOfBirth}</li>
                            </ul>
                        </>
                    }
                </div>
                <div className='flex items-center justify-between '>
                    <div className="flex items-center">
                        <h2 className='text-2xl font-medium px-3'>My Posts</h2>
                        <Chip className='bg-gray-100 font-extrabold'>{userPostsCount}</Chip>
                    </div>
                    {issortPosts ? <Chip onClick={handleSortedPosts} className='cursor-pointer bg-gray-100 font-extrabold flex items-center gap-1'> <LiaSortAmountUpAltSolid /></Chip> : <Chip onClick={handleSortedPosts} className='cursor-pointer bg-gray-100 font-extrabold flex items-center gap-1'> <LiaSortAmountDownSolid /></Chip>}
                </div>
                <div className='Cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-4 gap-4'>
                    {
                        isUserPostsLoading && <>
                            <ProfileCardSkeleton />
                            <ProfileCardSkeleton />
                            <ProfileCardSkeleton />
                        </>
                    }
                    {!isUserPostsLoading && !isUserPostsError && !userPostsCount && (
                        <h1 className="text-4xl md:!text-7xl mt-10 text-shadow-md  col-span-3 mx-auto text-gray-500 font-bold">
                            No Posts Yet
                        </h1>
                    )}
                    {
                        sortedUserPosts?.map(post => {
                            return <PostCard key={post._id} post={post} from='profile' />
                        })
                    }
                </div>
            </div>
        </div>
    )
}
