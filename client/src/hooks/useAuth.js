import React, { useEffect } from 'react'
import {useNavigate} from "react-router-dom"
import {useSelector,useDispatch} from "react-redux"
import toast from 'react-hot-toast'
import { logoutuser } from '../http/networkRequest'
import { userLogoutSuccess } from '../redux/userSlice'
const useAuth = () => {
    const dispatch=useDispatch()
    const {user}=useSelector(state=>state.users)
    const navigate=useNavigate()
    useEffect(()=>{
        const checkTokenExpiration=async()=>{
            const ttl=user?.ttl
            if(ttl && ttl<Math.round(Date.now())){
                toast.success("Session Timeout.......")
                await logoutuser()
                dispatch(userLogoutSuccess())
                navigate("/login")
            }
        }
        checkTokenExpiration()
    },[user,navigate])
}

export default useAuth