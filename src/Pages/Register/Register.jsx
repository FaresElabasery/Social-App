import { Button, Form, Input, Select, SelectItem } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import useAuth from '../../Hooks/useAuth';
import styles from './Register.module.css';
export default function Register() {
    const [isVisible, setIsVisible] = useState(false);
    const [loginVisible, setLoginVisible] = useState(false)
    const toggleVisibility = () => setIsVisible(!isVisible);
    const registerSchema = z.object({
        name: z.string().trim().nonempty('name is requried').min(3, 'must be at least 3 char'),
        email: z.string().trim().nonempty('email is requried').email('invalid email'),
        password: z.string().trim().nonempty('password is requried').regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'),
        rePassword: z.string().trim().nonempty('rePassword is requried').refine((value) => value === getValues('password'), {
            message: 'confirm your password'
        }),
        dateOfBirth: z.coerce.date().refine((value) => Boolean(new Date().getFullYear() - value.getFullYear() > 18), {
            message: 'must be above 18 Years'
        }).transform((value) => `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`),
        gender: z.enum(['male', 'female'], 'Gender is required')
    })
    const loginSchema = z.object({
        email: z.string().trim().nonempty('email is requried').email('invalid email'),
        password: z.string().trim().nonempty('password is requried').regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'),
    })
    const { handleSubmit, register, formState: { errors }, setError, getValues, clearErrors } = useForm(
        {
            'defaultValues': {
                "name": '',
                "email": '',
                "password": '',
                "rePassword": '',
                "dateOfBirth": '',
                "gender": ''
            },
            mode: 'onTouched',
            resolver: zodResolver(registerSchema)
        }
    );


    const { handleSubmit: loginSubmit, register: loginRegister, formState: { errors: loginErrors } } = useForm(
        {
            'defaultValues': {
                "email": '',
                "password": '',
            },
            mode: 'onTouched',
            resolver: zodResolver(loginSchema)
        }
    );

    const { mutate, isPending: registerLoading, isError: registerError, error: registerErrorMsg } = useAuth('signup')
    const { mutate: loginMutate, isPending: loginLoading, isError: loginError, error: loginErrorMsg } = useAuth('signin')

    useEffect(() => {
        if (registerError) {
            setError("email", {
                type: "manual",
                message: registerErrorMsg?.response?.data?.error
            })
        }
    }, [registerError, setError])


    return (
        <main className='bg-[#E1E8EE]' >
            <div className='overflow-hidden'>
                <div className={`${styles.mainCard} my-12 w-full sm:max-w-[450px] sm:w-10/12 md:w-1/2 p-4 bg-gradient-to-b mx-auto bg-white/30 backdrop-blur-sm  border-gray-50/30 rounded-2xl bg-cover relative overflow-hidden pb-10`}>
                    <button className={`duration-700 w-full transition-transform ${loginVisible ? '-translate-y-2' : 'translate-y-5 cursor-pointer '}`} onClick={() => !loginVisible && setLoginVisible(!loginVisible)}>
                        <h1 className={`text-center text-gray-500 duration-700 pt-5 !text-lg ${loginVisible ? 'hidden' : ''}`}>or</h1>
                        <h1 className={`text-center text-white duration-700 ${loginVisible ? 'text-lg pt-5' : ''}`}>Sign up</h1>
                        <p className='text-xs font-bold text-white text-center mt-1'>{!loginVisible ? "Don't have an account?" : ''}</p>
                    </button>
                    <Form onSubmit={handleSubmit(mutate)} autoComplete='on' className={`max-w-[300px] mx-auto gap-0 duration-700 p-5 ${loginVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <Input
                            classNames={{
                                inputWrapper: "bg-white rounded-t-xl rounded-b-none border-1 ",
                                label: "text-default-400"
                            }}
                            className="w-full z-0"
                            errorMessage={errors.name?.message}
                            isInvalid={Boolean(errors.name)}
                            label="Name"
                            type="text"
                            name='name'
                            variant="bordered"
                            autoComplete="name"
                            {...register('name')}
                        />
                        <Input
                            classNames={{
                                inputWrapper: "bg-white rounded-none border-1",
                                label: "text-default-400"
                            }}
                            className="w-full z-0"
                            errorMessage={errors.email?.message}
                            isInvalid={Boolean(errors.email)}
                            label="Email"
                            type="email"
                            name='email'
                            autoComplete="email"
                            variant="bordered"
                            {...register('email')}
                        />
                        <Input
                            classNames={{
                                inputWrapper: "bg-white rounded-none border-1",
                                label: "text-default-400"
                            }}
                            endContent={
                                <button
                                    aria-label="toggle password visibility"
                                    className="focus:outline-solid outline-transparent"
                                    type="button"
                                    onClick={toggleVisibility}
                                >
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            className="w-full z-0"
                            errorMessage={errors.password?.message}
                            isInvalid={Boolean(errors.password)}
                            label="Password"
                            autoComplete="new-password"
                            type={isVisible ? "text" : "password"}
                            name='password'
                            variant="bordered"
                            {...register('password')}
                        />
                        <Input
                            classNames={{
                                inputWrapper: "bg-white rounded-none border-1",
                                label: "text-default-400"
                            }}
                            className="w-full z-0"
                            errorMessage={errors.rePassword?.message}
                            isInvalid={Boolean(errors.rePassword)}
                            label="Confirm Password"
                            autoComplete="new-password"
                            type="password"
                            name='rePassword'
                            variant="bordered"
                            {...register('rePassword')}
                        />
                        <Input
                            classNames={{
                                inputWrapper: "bg-white rounded-none text-default-400 border-0",
                                label: "text-default-400",
                            }}
                            className="w-full z-0"
                            errorMessage={errors.dateOfBirth?.message}
                            isInvalid={Boolean(errors.dateOfBirth)}
                            label="Date of Birth"
                            type="date"
                            name='dateOfBirth'
                            variant="bordered"
                            {...register('dateOfBirth')}
                        />
                        <Select
                            classNames={{
                                trigger: "bg-white rounded-t-none rounded-b-xl text-default-400",
                                label: "text-default-400"
                            }}
                            className="w-full z-0"
                            label="Gender"
                            errorMessage={errors.gender?.message}
                            isInvalid={Boolean(errors.gender)}
                            placeholder="Select a gender"
                            variant="bordered"
                            name='gender'
                            {...register('gender')}
                        >
                            <SelectItem key='male'>Male</SelectItem>
                            <SelectItem key='female'>Female</SelectItem>
                        </Select>
                        <Button type='submit' isDisabled={registerLoading} isLoading={registerLoading} className='bg-black/40 w-full my-4 hover:bg-black text-white'>{registerLoading ? 'loading' : 'Sign up'}</Button>
                    </Form>
                    <div className={`absolute left-0 rounded-t-[100%]  transition-all duration-700  w-full h-[100px]  bg-white ${loginVisible ? '-translate-y-[20px]' : '-translate-y-[400px]'}`}>
                        <div className={`w-full h-full flex flex-col items-center ${loginVisible ? 'cursor-pointer' : ''} `} onClick={() => loginVisible && setLoginVisible(!loginVisible)}>
                            <h6 className={`${loginVisible ? 'text-lg mt-2' : 'text-3xl mt-10'}  font-bold`}>Login</h6>
                            <p className='text-xs font-light text-default-400'>{loginVisible ? 'Already have an account?' : ''}</p>
                        </div>
                    </div>
                    <div className={`bg-white absolute w-full transition-all duration-700  left-0 ${loginVisible ? 'translate-y-10 ' : 'h-100 -translate-y-80'}`}>
                        <div className='w-full h-full flex flex-col items-center max-w-[300px] mx-auto gap-0 p-5 mt-5'>
                            <Form className='gap-0' onSubmit={loginSubmit(loginMutate)}>
                                <Input
                                    classNames={{
                                        inputWrapper: "bg-white rounded-t-xl rounded-b-none border-1",
                                        label: "text-default-400"
                                    }}
                                    className="w-full z-0"
                                    errorMessage={loginErrors.email?.message}
                                    isInvalid={Boolean(loginErrors.email)}
                                    label="Email"
                                    type="email"
                                    name='email'
                                    autoComplete="email"
                                    variant="bordered"
                                    {...loginRegister('email')}
                                />
                                <Input
                                    classNames={{
                                        inputWrapper: "bg-white rounded-b-xl rounded-t-none border-1",
                                        label: "text-default-400"
                                    }}
                                    endContent={
                                        <button
                                            aria-label="toggle password visibility"
                                            className="focus:outline-solid outline-transparent"
                                            type="button"
                                            onClick={toggleVisibility}
                                        >
                                            {isVisible ? (
                                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                            ) : (
                                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                            )}
                                        </button>
                                    }
                                    className="w-full z-0"
                                    errorMessage={loginErrors.password?.message}
                                    isInvalid={Boolean(loginErrors.password)}
                                    label="Password"
                                    autoComplete="new-password"
                                    type={isVisible ? "text" : "password"}
                                    name='password'
                                    variant="bordered"
                                    {...loginRegister('password')}
                                />
                                <Button type='submit' isDisabled={loginLoading} isLoading={loginLoading} className='bg-[#6B92A4] w-full my-4  text-white'>{loginLoading ? 'loading' : 'Login'}</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    )
}

export const EyeSlashFilledIcon = (props) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
                fill="currentColor"
            />
            <path
                d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
                fill="currentColor"
            />
            <path
                d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
                fill="currentColor"
            />
            <path
                d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
                fill="currentColor"
            />
            <path
                d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
                fill="currentColor"
            />
        </svg>
    );
};

export const EyeFilledIcon = (props) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
                fill="currentColor"
            />
            <path
                d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
                fill="currentColor"
            />
        </svg>
    );
};
