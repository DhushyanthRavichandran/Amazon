import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearAuthError, resetPassword } from "../../actions/authAction";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the CSS for react-toastify

export const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [conPassword, setConPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { isAuthenticated, error } = useSelector((state) => state.authState);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("password", password);
        formData.append("confirmPassword", conPassword);
        dispatch(resetPassword(formData, token));
    }

    useEffect(() => {
        if (isAuthenticated) {
            toast.success('Password Reset Success!', {
                position: "bottom-center",
            });
            navigate('/');
        } else if (error) {
            toast.error(error, {
                position: "bottom-center",
                onOpen: () => { dispatch(clearAuthError) }
            });
        }
    }, [error, dispatch, isAuthenticated, navigate]);

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={submitHandler}>
                    <h1 className="mb-3">New Password</h1>
                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm_password_field">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password_field"
                            className="form-control"
                            value={conPassword}
                            onChange={e => setConPassword(e.target.value)}
                        />
                    </div>
                    <button
                        id="new_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Set Password
                    </button>
                </form>
            </div>
        </div>
    );
}
