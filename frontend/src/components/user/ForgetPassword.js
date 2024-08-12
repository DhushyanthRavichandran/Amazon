import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, forgotPassword } from "../../actions/authAction";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the CSS for react-toastify


export const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const { error, message } = useSelector((state) => state.authState);
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("email", email);
        dispatch(forgotPassword(formData));
    }

    useEffect(() => {
        if (message) {
            toast.success(message, {
                position: "bottom-center",
            });
            setEmail("");
        } else if (error) {
            toast.error(error, {
                position: "bottom-center",
                onOpen: () => { dispatch(clearAuthError) }
            });
        }
    }, [error, dispatch, message]);

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={submitHandler}>
                    <h1 className="mb-3">Forgot Password</h1>
                    <div className="form-group">
                        <label htmlFor="email_field">Enter Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <button
                        id="forgot_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Send Email
                    </button>
                </form>
            </div>
        </div>
    );
}
