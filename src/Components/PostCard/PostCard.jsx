import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, useDisclosure } from "@heroui/react";
import moment from "moment/moment";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaCaretRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import placeholder from '../../assets/userPlaceHolder.png';
import ConfirmModal from "../../ConfirmModal/ConfirmModal";
import useDelete from "../../Hooks/useDelete";
import useUpdate from "../../Hooks/useUpdate";
import { ToastConfig } from "../../utils/ToastConfig";
import UpdatePostModal from "../UpdatePostModal/UpdatePostModal";
import styles from './PostCard.module.css';

export default function PostCard({ post, from, isUserPost }) {
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmOpenChange } = useDisclosure();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [isFollowed, setIsFollowed] = useState(false);
    const [MoreComments, setMoreComments] = useState(2);
    const [image, setImage] = useState(post.image || null)
    const [body, setBody] = useState(post.body || null)

    const navigate = useNavigate()

    // navigate to post details
    const handlePostDetails = () => {
        if (from !== 'PostDetails') {
            navigate(`/postDetails/${post._id}`)
        }
    }
    // see more comments
    const handleSeeMoreComments = () => {
        if (from == 'PostDetails') {
            setMoreComments(MoreComments + 20)
        } else {
            setMoreComments(MoreComments + 2)
        }
    }

    // useDelete hook
    const { mutate: deletePost, isPending, isSuccess } = useDelete('deletePost', post._id, from)




    // validate the image

    const handleUpdatePhotoPost = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 4 * 1000 * 1000) {
            toast.error('Please upload a file less than 4MB', ToastConfig)
            setImage(null)
        } else if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
            toast.error('Please upload a valid image', ToastConfig)
            setImage(null)
        }
        else {
            setImage(file)
        }
    }
    const resetUpdateForm = () => {
        setImage(post.image)
        onClose()
    }

    const { mutate: updatePost, isPending: isUpdatePending } =useUpdate('updatePost', image, onClose, body, post._id, resetUpdateForm)

    return (
        <Card className={` animate-appearance-in duration-250  ${from != 'PostDetails' ? 'group' : ''} ${isPending || isUpdatePending ? 'animate-fade-out' : ''} ${isSuccess ? 'animate-appearance-out' : ''}`}>
            <CardHeader className="justify-between">
                <div className="flex gap-5">
                    <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={post?.user?.photo}
                        alt={post?.user?.name}
                        color="primary"
                        classNames={{
                            img: "object-cover object-top",
                        }}
                    />
                    <div className="flex flex-col gap-1 items-start justify-center">
                        <h4 className="text-small font-semibold leading-none text-default-600">{post.user?.name?.split(' ').slice(0, 2).join(' ')}</h4>
                        <h5 className="text-small tracking-tight text-default-400">{moment(post.createdAt).startOf('now').fromNow()}</h5>
                    </div>
                </div>
                {from !== 'profile' && !isUserPost ? <Button
                    className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
                    color="primary"
                    radius="full"
                    size="sm"
                    variant={isFollowed ? "bordered" : "solid"}
                    onPress={() => setIsFollowed(!isFollowed)}
                >
                    {isFollowed ? "Unfollow" : "Follow"}
                </Button>
                    : <Dropdown>
                        <DropdownTrigger>
                            <span className="p-2 duration-250 hover:bg-gray-100 rounded-2xl"><BsThreeDots size={20} /></span>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                            <DropdownItem key="edit" onPress={() => { onOpen() }}>Edit Post</DropdownItem>
                            <DropdownItem key="delete" className="text-danger" color="danger" onPress={() => { onConfirmOpen() }}>
                                Delete Post
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>}
                <ConfirmModal deletePost={deletePost} isConfirmOpen={isConfirmOpen} onConfirmOpenChange={onConfirmOpenChange} />
                <UpdatePostModal isOpen={isOpen} onClose={onClose} handleUpdatePhotoPost={handleUpdatePhotoPost} updatePost={updatePost} resetUpdateForm={resetUpdateForm} image={image} setImage={setImage} body={body} setBody={setBody} isUpdatePending={isUpdatePending} post={post}/>
            </CardHeader>
            <CardBody onClick={handlePostDetails} className={`px-3 py-0 text-small text-default-500 overflow-hidden ${from != 'PostDetails' ? 'cursor-pointer' : ''}`}>
                <p className={`${post.image == undefined ? '!pb-0' : ' ps-1'} ${from == 'profile' ? styles.postText : ''}`}>{from == 'profile' ? post.body.split(' ').slice(0, 10).join(' ') : post.body}</p>
                {
                    post.image == undefined || from == 'profile' ? <></> :
                        <Image
                            alt={post.body}
                            className={`object-cover group-hover:cursor-zoom-in  group-hover:scale-102 transition-all duration-250 rounded-xl ${from == 'PostDetails' ?
                                '!h-full' : 'h-90'}`}
                            src={post.image}
                            width={'100%'}
                        />
                }

            </CardBody>
            <CardFooter className="gap-3 border-b-1 border-default-100 rounded-none">
                <div className="flex gap-1">
                    <p className="font-semibold text-default-500 text-small">{Math.floor(post?.comments?.length / 2)}</p>
                    <p className=" text-default-500 text-small">Likes</p>
                </div>
                <div className="flex gap-1">
                    <p className="font-semibold text-default-500 text-small">{post?.comments?.length}</p>
                    <p className="text-default-500 text-small">Comments</p>
                </div>
                {from == 'profile' &&
                    <div className="absolute bottom-5 hover:scale-105 duration-250 end-2 z-20" onClick={handlePostDetails}>
                        <Image
                            alt={post.body}
                            className={`object-cover group-hover:cursor-zoom-in  group-hover:scale-102 transition-all duration-250 rounded-xl size-15`}
                            src={post.image}
                            width={'100%'}
                        />
                    </div>
                }
            </CardFooter>
            {from != 'profile' && post.comments?.length > 0 && <>
                {post.comments.slice(0, MoreComments).map(comment => (
                    <CardFooter className="comments flex justify-between items-start" key={comment._id}>
                        <div className="flex gap-5">
                            <Avatar
                                isBordered
                                radius="full"
                                size="md"
                                src={comment?.commentCreator.photo}
                                fallback={<Avatar isBordered
                                    radius="full"
                                    size="md"
                                    src={placeholder} />}
                                showFallback
                            />
                            <div className="flex flex-col gap-1 items-start justify-center">
                                <h4 className="text-small font-semibold leading-none text-default-600">{comment?.commentCreator.name}</h4>
                                <h5 className="text-small tracking-tight text-default-400">{comment.content}</h5>
                            </div>
                        </div>
                        <span className="text-small text-default-400 capitalize">{moment(comment.createdAt).startOf('now').fromNow()}</span>
                    </CardFooter>
                ))}
                {MoreComments <= post.comments?.length && (
                    <CardFooter className="comments flex justify-between items-start" >
                        <div className="flex flex-col gap-1 items-start justify-center">
                            <h5 className="text-small tracking-tight text-default-400 hover:text-default-500 cursor-pointer relative group/comment" onClick={() => handleSeeMoreComments()}><span>Load More Comments</span><span className="absolute  top-1/2 -translate-y-1/2 group-hover/comment:translate-x-1 group-hover/comment:scale-120  duration-250"><FaCaretRight size={15} /></span></h5>
                        </div>
                    </CardFooter>
                )}
            </>
            }
        </Card>
    );
}

