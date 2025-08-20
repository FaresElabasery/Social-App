import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Image } from "@heroui/react";
import moment from "moment/moment";
import { useState } from "react";
import placeholder from '../../assets/userPlaceHolder.png';
import { useNavigate } from "react-router-dom";
import { FaCaretRight } from "react-icons/fa6";

export default function PostCard({ post, from }) {

    const [isFollowed, setIsFollowed] = useState(false);
    const [MoreComments, setMoreComments] = useState(2);
    const navigate = useNavigate()

    const handlePostDetails = () => {
        if (from !== 'PostDetails') {
            navigate(`/postDetails/${post._id}`)
        }
    }
    const handleSeeMoreComments = () => {
        if (from == 'PostDetails') {
            setMoreComments(MoreComments + 20)
        } else {
            setMoreComments(MoreComments + 2)
        }
    }

    return (
        <Card className={`my-2 animate-appearance-in duration-250 ${from != 'PostDetails' ? 'group' : ''}`}>
            <CardHeader className="justify-between">
                <div className="flex gap-5">
                    <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={post.user?.photo}
                        alt={post.user?.name}
                        color="primary"
                    />
                    <div className="flex flex-col gap-1 items-start justify-center">
                        <h4 className="text-small font-semibold leading-none text-default-600">{post.user?.name}</h4>
                        <h5 className="text-small tracking-tight text-default-400">{moment(post.createdAt).format('lll')}</h5>
                    </div>
                </div>
                <Button
                    className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
                    color="primary"
                    radius="full"
                    size="sm"
                    variant={isFollowed ? "bordered" : "solid"}
                    onPress={() => setIsFollowed(!isFollowed)}
                >
                    {isFollowed ? "Unfollow" : "Follow"}
                </Button>
            </CardHeader>
            <CardBody onClick={handlePostDetails} className={`px-3 py-0 text-small text-default-500 overflow-hidden ${from != 'PostDetails' ? 'cursor-pointer' : ''}`}>
                <p className={`${post.image == undefined ? '!pb-0' : 'pb-3 ps-1'}`}>{post.body}</p>
                {post.image == undefined ? <></> :
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
            </CardFooter>
            {post.comments?.length > 0 && <>
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
                        <span className="text-small text-default-400 capitalize">{moment(comment.createdAt).format('LL')}</span>
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

