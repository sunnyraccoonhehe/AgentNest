import { useAppDispatch, useAppSelector } from '../../../../hooks/useAppDispatch';
import { logout } from '../../../../features/auth/authSlice';
import style from './UserPopup.module.css';
import { useNavigate } from 'react-router-dom';

type UserPopupProps = {
    onClose: () => void;
};


function UserPopup({ onClose }: UserPopupProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user }  = useAppSelector((state) => state.auth);


    const handleLogout = () => {
        dispatch(logout());
        onClose();
        navigate('/');
    };

    return (
        <div className={style.overlay} onClick={onClose}>
            <div className={style.popup} onClick={(e) => e.stopPropagation()}>
                <button className={style.closeBtn} onClick={onClose}>✕</button>
                
                <div className={style.userInfo}>
                    <p className={style.nickname}>{user?.username || 'Без имени'}</p>
                    {/* <p className={style.email}>{user?.email || 'email не указан'}</p> */}
                    {user?.phone && (
                        <p className={style.phone}>📱 {user.phone}</p>
                    )}
                </div>

                <button className={style.logoutBtn} onClick={handleLogout}>
                    <span></span> Выйти
                </button>
            </div>
        </div>
    );
}

export default UserPopup; 