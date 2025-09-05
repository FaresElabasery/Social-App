import {
    Button,
    Divider,
    Form,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { BiSolidShow } from "react-icons/bi";
import { GrFormViewHide } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import { ToastConfig } from "../../utils/ToastConfig";




export default function ChangePasswordModal({ isOpen, onClose }) {
    const { userToken, setUserToken } = useContext(AuthContext)
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const navigate = useNavigate()


    const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            ConfirmPassword: ""
        }
        ,
        mode: 'onSubmit'
    })
    const handleChangePassword = (values) => {
        return axios.patch(`${import.meta.env.VITE_BASE_URL}/users/change-password`, {
            password: values.oldPassword,
            newPassword: values.newPassword
        }, {
            headers: {
                token: userToken
            }
        })
    }
    const { mutate: changePassword, isPending, isError, isSuccess } = useMutation({
        mutationKey: ['changePassword'],
        mutationFn: handleChangePassword,
        onSuccess: () => {
            onClose()
            toast.success('Password Changed Successfully', ToastConfig)
            localStorage.removeItem('token')
            setUserToken('')
            reset()
            setTimeout(() => {
                toast.info('redirecting to Login page', ToastConfig)
                navigate('/login')
            }, 2500);
        },
        onError: () => {
            toast.error('Error in Updating Password', ToastConfig)
        }
    })

    return (
        <>
            <Modal isOpen={isOpen} placement="top-center" onClose={onClose} className={`${isSuccess ? 'animate-appearance-out' : 'animate-appearance-in'}`}>
                <Form validationBehavior="aria" onSubmit={handleSubmit(changePassword)}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Change Password</ModalHeader>
                                <ModalBody>
                                    <Input
                                        isInvalid={isError || Boolean(errors.oldPassword)}
                                        errorMessage={isError ? 'Incorrect Old Password' : errors?.oldPassword?.message}
                                        endContent={
                                            showOldPassword ?
                                                <BiSolidShow onClick={() => setShowOldPassword((perv) => !perv)} className=" duration-250 hover:text-dark  cursor-pointer text-2xl text-default-400 animate-appearance-in " /> :
                                                <GrFormViewHide onClick={() => setShowOldPassword((perv) => !perv)} className=" duration-250 hover:text-dark  cursor-pointer text-2xl text-default-400 animate-appearance-in " />
                                        }
                                        label="Old Password"
                                        placeholder="Enter your old password"
                                        type={showOldPassword ? "text" : "password"}
                                        variant="flat"
                                        {...register("oldPassword", {
                                            required: 'Password is required',
                                            pattern: {
                                                value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                                                message: 'Password must be 8 character contain at least one uppercase letter, one lowercase letter, one number and one special character'
                                            },
                                        }
                                        )}
                                    />
                                    <Divider className="my-4" />

                                    <Input
                                        isInvalid={Boolean(errors.newPassword)}
                                        errorMessage={errors.newPassword?.message}
                                        endContent={
                                            showPassword ?
                                                <BiSolidShow onClick={() => setShowPassword((perv) => !perv)} className=" duration-250 hover:text-dark  cursor-pointer text-2xl text-default-400 animate-appearance-in " /> :
                                                <GrFormViewHide onClick={() => setShowPassword((perv) => !perv)} className=" duration-250 hover:text-dark  cursor-pointer text-2xl text-default-400 animate-appearance-in " />
                                        }
                                        label="New Password"
                                        placeholder="Enter your new password"
                                        type={showPassword ? "text" : "password"}
                                        variant="flat"
                                        {...register("newPassword", {
                                            required: 'Password is required',
                                            pattern: {
                                                value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                                                message: 'Password must be 8 character contain at least one uppercase letter, one lowercase letter, one number and one special character'
                                            },
                                            validate: (data) => {
                                                if (data === getValues('oldPassword')) {
                                                    return 'New password must be different from old password'
                                                }
                                                return true
                                            }
                                        })}
                                    />
                                    <Input
                                        isInvalid={Boolean(errors.ConfirmPassword)}
                                        errorMessage={errors.ConfirmPassword?.message}
                                        endContent={
                                            showPasswordConfirm ?
                                                <BiSolidShow onClick={() => setShowPasswordConfirm((perv) => !perv)} className=" duration-250 hover:text-dark  cursor-pointer text-2xl text-default-400 animate-appearance-in " /> :
                                                <GrFormViewHide onClick={() => setShowPasswordConfirm((perv) => !perv)} className=" duration-250 hover:text-dark  cursor-pointer text-2xl text-default-400 animate-appearance-in " />
                                        }
                                        label="Confirm Password"
                                        placeholder="Confirm your password"
                                        type={showPasswordConfirm ? "text" : "password"}
                                        variant="flat"
                                        {...register('ConfirmPassword', {
                                            required: 'Confirm Pasword is Required',
                                            validate: (value) => {
                                                if (value !== getValues('newPassword')) {
                                                    return 'Passwords do not match'
                                                }
                                            }
                                        })}
                                    />
                                    <div className="flex pt-2 px-1 justify-center">
                                        <p className="text-xs text-gray-400 ">Please be sure you will remember it !</p>
                                    </div>
                                </ModalBody>
                                <ModalFooter className="flex">
                                    <Button fullWidth color="danger" type="reset" variant="flat" onPress={onClose} isLoading={isPending}>
                                        Cancel
                                    </Button>
                                    <Button fullWidth color="primary" type="submit" isLoading={isPending}>
                                        Change Password
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Form>
            </Modal >
        </>
    );
}
