import React from 'react'
import { useUser } from '../context/UserContext'

const HomePage = () => {
    const { user, isAdmin } = useUser();

    console.log(isAdmin);

    return (
        <div className=''>
            HomePage
        </div>
    )
}

export default HomePage
