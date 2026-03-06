import { useState } from 'react'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import ForgotPasswordPage from './ForgotPasswordPage'

type AuthPage = 'login' | 'register' | 'forgot-password'

interface LoggedOutViewProps {
  onAuthSuccess: (token: string) => void
}

export default function LoggedOutView({ onAuthSuccess }: LoggedOutViewProps) {
  const [currentPage, setCurrentPage] = useState<AuthPage>('login')

  if (currentPage === 'register') {
    return <RegisterPage onAuthSuccess={onAuthSuccess} onNavigate={setCurrentPage} />
  }

  if (currentPage === 'forgot-password') {
    return <ForgotPasswordPage onNavigate={setCurrentPage} />
  }

  return <LoginPage onAuthSuccess={onAuthSuccess} onNavigate={setCurrentPage} />
}
