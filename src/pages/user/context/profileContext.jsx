
import React, { createContext, useEffect, useState } from 'react'; 


const ProfileContext = createContext();

export const ProfileProvider = ({children})=>{

    const [proProfile , setProProfile] = useState(()=>{
      const savedProfile = localStorage.getItem('proProfile');
      return savedProfile ? JSON.parse(savedProfile) : {};
    })



    useEffect(()=>{
        localStorage.setItem("proProfile",JSON.stringify(proProfile))
    },[proProfile])

    return(
       <ProfileContext.Provider value={{proProfile,setProProfile}}>
         {children}
       </ProfileContext.Provider>
    )

}


export default ProfileContext