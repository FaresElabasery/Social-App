
import { Avatar, Button, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from '@heroui/react';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import placeholder from '../../assets/userPlaceHolder.png';
import { AuthContext } from '../../Context/AuthContext/AuthContext';
import useDelete from '../../Hooks/useDelete';
import { useForm } from 'react-hook-form';
import { Form } from 'react-router-dom';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function CommentCard({ comment, post, setisEditingComment }) {
    const queryClient = useQueryClient()
    const { userInfo, userToken } = useContext(AuthContext)
    const [isUserPost, setIsUserPost] = useState(false)
    const checkUserPost = userInfo?.user?._id == post?.user._id
    const checkUserComment = userInfo?.user?._id == comment?.commentCreator._id
    const [isEditing, setisEditing] = useState(false)
    const [hasError, setHasError] = useState(false)

    const handleEditComment = (values) => {
        setisEditing(true)
        console.log(comment?._id);
        return axios.put(`${import.meta.env.VITE_BASE_URL}/comments/${comment?._id}`, values, {
            headers: {
                token: userToken
            }
        })
    }
    //  comments 
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            content: comment?.content
        }
        ,
        mode: 'onChange'
    })
    const { mutate: updateComment, isPending: isUpdating, isSuccess: isUpdated } = useMutation({
        mutationKey: ['updateCommment'],
        mutationFn: handleEditComment,
        onSuccess: () => {
            setisEditing(false)
            queryClient.invalidateQueries({ queryKey: ['userInfo'] })
            queryClient.invalidateQueries({ queryKey: ['userPosts'] })
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails', post._id] })
            reset()
            setisEditingComment(false)
        }
    })

    useEffect(() => {
        if (post) {
            setIsUserPost(!!checkUserPost)
        }
    }, [post, checkUserPost])

    useEffect(() => {
        if (isEditing) {
            setHasError(true)
            reset({ content: comment.content })
            setisEditingComment(true)
        }
    }, [isEditing])


    const { mutate: deleteComment, isSuccess: isCommentDeleted, isPending: isCommentDeleting } = useDelete('deleteComment', comment?._id)

    return (
        <CardFooter className={`comments flex justify-between items-start  ${isCommentDeleting || isUpdating ? 'animate-blink pointer-events-none' : ''} ${isCommentDeleted ? 'hidden transition-all duration-250 pointer-events-none' : 'animate-appearance-in'} px-4 py-2 `} >
            {isEditing ?
                <>
                    <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        color='warning'
                        className='p-5'
                        src={comment?.commentCreator.photo}
                        fallback={<Avatar isBordered
                            radius="full"
                            size="md"
                            src={placeholder} />}
                        showFallback
                    />
                    <Form className="flex flex-row gap-2 ms-3 w-full items-start" onSubmit={handleSubmit(updateComment)} >
                        <Input
                            endContent={
                                <span className="flex-center  cursor-pointer text-default-400 hover:text-gray-800 duration-250  rounded-full">
                                    <IoMdCloseCircleOutline size={20} onClick={() => { setisEditing(false), reset({ content: comment.content }) }} />
                                </span>
                            }
                            placeholder="Add a comment"
                            radius="md"
                            size="md"
                            isInvalid={Boolean(errors.content)}
                            errorMessage={errors.content?.message}
                            variant="bordered"
                            {...register('content', {
                                validate: (value) => {
                                    setHasError(false)
                                    if (value.trim().length > 30) {
                                        return 'Comment must be at most 30 characters'
                                    }
                                    if (value.trim().length < 2) {
                                        return 'Comment must be at least 2 characters'
                                    }
                                    if (value.trim() == comment.content) {
                                        return 'Comment must be different from the previous one'
                                    }
                                },
                            })}
                            isDisabled={isUpdating}
                        />
                        <Button color="primary" type="submit" radius="md" variant="solid" isDisabled={Boolean(errors.content) || hasError}  >
                            Update
                        </Button>
                    </Form>
                </>
                :
                <>
                    <div className="flex items-center group ">
                        <div className={`flex items-center gap-3 pe-5 py-1  ${isUserPost ? 'group-hover:bg-gray-50 group-hover:rounded-3xl' : ''}`}>
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
                        {isUserPost &&
                            <Dropdown>
                                <DropdownTrigger>
                                    <span className="flex-center m-1 cursor-pointer text-white group-hover:text-default-400 p-1 hover:bg-gray-50 hover:text-gray-800 duration-250  rounded-full">
                                        <BsThreeDots size={20} />
                                    </span>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions">
                                    {checkUserComment && <DropdownItem key="edit" onPress={() => { setisEditing(true) }}>Edit Comment</DropdownItem>}
                                    <DropdownItem key="delete" className="text-danger" color="danger" onPress={() => { deleteComment() }}>
                                        Delete Comment
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        }
                    </div>
                    <span className="text-xs sm:text-small text-default-400 capitalize text-nowrap">
                        {moment(comment.createdAt).startOf('now').fromNow()}
                    </span>
                </>
            }

        </CardFooter>
    )
}
