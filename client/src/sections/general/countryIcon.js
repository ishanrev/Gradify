import { IN, US } from 'country-flag-icons/react/3x2'
import { useEffect } from 'react'
import countryIcons from './countryList'


export default function FlagIcon({ cnt }) {
    useEffect(() => {
        console.log(cnt)
    }, [])
    return (
        <>
            {countryIcons[cnt]}
        </>
    )
}