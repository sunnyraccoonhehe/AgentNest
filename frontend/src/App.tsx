import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing/Landing'
import Plannery from './pages/Plannery/Plannery'
import AuthPage from './pages/Auth/AuthPage'
import useIsMobile from './hooks/useIsMobile'
import { useSelector } from 'react-redux'
import type { RootState } from './app/store'
import Chat from './pages/Chat/Chat'
import Daily from './pages/Daily/Daily'
import { useAppDispatch, useAppSelector } from './hooks/useAppDispatch'
import { fetchCurrentUser } from './features/auth/authSlice'

function App() {
	
	const theme = useSelector(
		(state: RootState) => state.theme.mode
	);

	useEffect(() => {
		document.documentElement.setAttribute(
			'data-theme',
			theme
		);
	}, [theme]);

	const isMobile = useIsMobile();

	const dispatch = useAppDispatch();
	const { token, user } = useAppSelector(state => state.auth);

	useEffect(() => {
	if (token && !user) {
		dispatch(fetchCurrentUser());
	}
	}, []);

	return (
	<Routes>
		<Route 
			path="/" 
			element={token ? <Navigate to="/user" replace /> : <Landing/>} 
		/>
		<Route 
			path="/auth" 
			element={token ? <Navigate to="/user" replace /> : <AuthPage />} 
		/>
		<Route 
			path="/user" 
			element={token ? <Plannery isMobile={isMobile}/> : <Navigate to="/auth" replace />} 
		/>
		<Route
			path="/chat"
			element={token ? <Chat/> : <Navigate to="/auth" replace />}
		/>
		<Route
			path="/daily"
			element={token ? <Daily/> : <Navigate to="/auth" replace />}
		/>
		<Route path="*" element={<Navigate to="/" replace />}/>
	</Routes>
	)
}

export default App