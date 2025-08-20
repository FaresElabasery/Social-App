import { Button } from '@heroui/react';
import styles from "./NotFound.module.css";
import { useNavigate } from 'react-router-dom';
export default function NotFound() {
    const navigate = useNavigate()
    return (
        <div className='flex items-center justify-center flex-col h-screen -mt-10'>
            <h2 className={` font-bold text-[clamp(100px,15vw,300px)] ${styles.notFound}`}>Oops!</h2>

            <h3 className='font-bold text-2xl'>404 page not found</h3>
            <p className='my-5'>Oops! The page you're looking for doesn't exist.</p>
            <Button onPress={()=>navigate('/posts')} className='text-white mt-3' color="warning">Back To Home </Button>
        </div>
    )
}
