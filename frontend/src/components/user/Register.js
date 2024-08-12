import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";
import {toast} from"react-toastify";
import { register,clearAuthError } from "../../actions/authAction";
export const Register = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
    const [userData,setUserData]=useState({
    name:"",
    email:"",
    password:""
   })
   const [avatar,setAvatar]=useState("");
   const [previewAvatar,setPreviewAvatar]=useState("images/default_avatar.png")
   

  const {loading,isAuthenticated,error}=useSelector((state)=>state.authState)

   const handleChange = (e) => {
    const { name, value } = e.target; // Correct destructuring
    if (name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
           if(reader.readyState === 2) {
            setPreviewAvatar(reader.result);
               setAvatar(e.target.files[0])
           }
      }
      reader.readAsDataURL(e.target.files[0])
  }
  else
  {
    setUserData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
  }
};
    useEffect(()=>{
    if(isAuthenticated){
      navigate('/');
      return;
    }
    if(error){
      toast(error, {
        position: "bottom-center",
        type: 'error',
        onOpen: ()=> { dispatch(clearAuthError) }
    })
    return
}
    },[error,dispatch,isAuthenticated,navigate])


    const submitHandler=(e)=>{
      e.preventDefault();
      const formData=new FormData();
      formData.append('name',userData.name);
      formData.append('email',userData.email);
      formData.append('password',userData.password);
      formData.append('avatar',avatar);
      dispatch(register(formData));
    }

    return (
       <Fragment>
        <div className="row wrapper">
	      	<div className="col-10 col-lg-5">
            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
            <h1 className="mb-3">Register</h1>

            <div className="form-group">
            <label htmlFor="email_field">Name</label>
            <input type="name" id="name_field" name="name" onChange={handleChange} className="form-control" />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                
                onChange={handleChange}
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                onChange={handleChange}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='avatar_upload'>Avatar</label>
              <div className='d-flex align-items-center'>
                  <div>
                      <figure className='avatar mr-3 item-rtl'>
                          <img
                              src={previewAvatar}
                              className='rounded-circle'
                              alt='image'
                              
                          />
                      </figure>
                  </div>
                  <div className='custom-file'>
                      <input
                          type='file'
                          name='avatar'
                          className='custom-file-input'
                          id='customFile'
                          onChange={handleChange}
                      />
                      <label className='custom-file-label' htmlFor='customFile'>
                          Choose Avatar
                      </label>
                  </div>
              </div>
          </div>
  
            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              
              disabled={loading}
            >
              REGISTER
            </button>
            </form>
		      </div>
        </div>
        </Fragment>
    );
};