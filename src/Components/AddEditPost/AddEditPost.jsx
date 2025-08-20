import { Button, Form, Textarea } from '@heroui/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import uploadIcon from "../../assets/uploadIcon.svg";
import { useClickAway } from 'react-use';
import { Bounce, toast } from 'react-toastify';
export default function AddEditPost() {
    const [ShowInput, setShowInput] = useState(false)
    const [image, setImage] = useState(null);
    const [body, setBody] = useState('');
    const ref = useRef(null)
    useClickAway(ref, () => {
        setShowInput(false)
    });

    const handlePeview = (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (file) {
            setImage(file)
        }
    }

    const clearPost = (body = true, image = true) => {
        body && setBody('')
        image && setImage(null)
        body && image && setShowInput(false)
    }

    const CreatePost = () => {
        const toastId = toast.loading('Posting...', {
            position: "top-center",
        });
        const formData = new FormData()
        body && formData.append('body', body)
        image && formData.append('image', image)
        axios.post(`${import.meta.env.VITE_BASE_URL}/posts`, formData, {
            headers: {
                token: localStorage.getItem('token')
            }
        }).then(res => {
            if (res.data.message === 'success') {
                toast.update(toastId, {
                    render: 'Post Created!',
                    type: 'success',
                    isLoading: false,
                    position: "top-center",
                    autoClose: 2000,
                    transition: Bounce,
                });
                clearPost()
            }
        }).catch(() => {
            toast.update(toastId, {
                render: 'Network Error',
                type: 'error',
                isLoading: false,
                position: "top-center",
                autoClose: 2000,
                transition: Bounce,
            });
        })

    }



    return (
        <div ref={ref} className='create-post w-full bg-[#F4F4F5] rounded-2xl' >
            {!ShowInput ? <p onClick={() => setShowInput(true)} className='capitalize p-3 bg-gray-100 rounded-2xl text-default-500 cursor-text font-semibold animate-appearance-in duration-250'>What is in your mind ?</p>
                : <Form className='relative animate-appearance-in duration-250' >
                    <Textarea
                        isClearable
                        label="Post your thought"
                        placeholder="Write something ..."
                        variant="flat"
                        size='md'
                        maxRows={3}
                        classNames={{
                            input: "mb-9",
                        }}
                        onClear={() => clearPost(true, false)}
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        radius={`${image ? 'none' : 'md'}`}

                    />
                    <div className='flex w-full px-2 justify-between items-center absolute bottom-1 start-0'>
                        <label htmlFor="upload" className=' flex items-center justify-center'>
                            <div className='p-2 cursor-pointer me-2 hover:bg-gray-200 rounded-full transition-all duration-250'>
                                <img src={uploadIcon} alt="upload icon" className='size-5 ' />
                            </div>
                        </label>
                        <input
                            type="file"
                            className="hidden"
                            id='upload'
                            accept="image/*"
                            onChange={(e) => handlePeview(e)}
                        />
                        <div className='flex flex-nowrap'>
                            <Button size='sm' className='mx-1' variant="ghost" type='reset' onPress={() => { clearPost() }}>Cancel</Button>
                            <Button size='sm' className='mx-1' color='primary' onPress={() => CreatePost()} variant="solid">Post</Button>
                        </div>
                    </div>
                </Form>
            }
            {image && ShowInput && (
                <div className='animate-appearance-in duration-250 h-90 px-4 mx-auto pt-3 relative'>
                    <svg onClick={() => clearPost(false, true)} className='absolute end-2 top-1 size-6 hover:text-black duration-250 text-black/50 cursor-pointer' aria-hidden="true" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em"><path d="M12 2a10 10 0 1010 10A10.016 10.016 0 0012 2zm3.36 12.3a.754.754 0 010 1.06.748.748 0 01-1.06 0l-2.3-2.3-2.3 2.3a.748.748 0 01-1.06 0 .754.754 0 010-1.06l2.3-2.3-2.3-2.3A.75.75 0 019.7 8.64l2.3 2.3 2.3-2.3a.75.75 0 011.06 1.06l-2.3 2.3z" fill="currentColor"></path></svg>
                    <img src={URL.createObjectURL(image)} alt="upload photo for post" className='h-full mx-auto object-contain rounded-2xl' />

                </div>
            )}
        </div>
    )
}
