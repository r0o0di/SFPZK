import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { adminList } from '@/lib/utils'
import type { User } from 'firebase/auth'

export function useAuthState() {
    const [user, setUser] = useState<User | null>(null)
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser)
            setAuthLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return { user, authLoading }
}

export function useAdminState() {
    const { user, authLoading } = useAuthState()
    const isAdmin = adminList.includes(user?.email ?? '')
    return { user, authLoading, isAdmin }
}