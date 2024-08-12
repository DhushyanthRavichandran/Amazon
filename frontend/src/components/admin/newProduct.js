import React, { Fragment, useEffect, useState } from 'react'
import { SideBar } from './SideBar'
import { createNewProduct } from '../../actions/productActions';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearProductCreated, clearProductDeleted } from '../../slices/productSlices';
import { clearError } from '../../slices/productsSlices';
import { toast } from 'react-toastify';

export const NewProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    
    const { loading, isProductCreated, error } = useSelector( state => state.productState)

    const categories = [
        'Electronics',
        'Mobile Phones',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ];
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onImageChange=(e)=>{
        const files=Array.from(e.target.files);
        files.forEach(file=>{
            const reader=new FileReader();
            reader.onload=()=>{
                if(reader.readyState==2){
                    setImagesPreview(oldArray=>[...oldArray,reader.result]);
                    setImages(oldArray=>[...oldArray,file])
                }
            }
            reader.readAsDataURL(file);
        })
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name' , name);
        formData.append('price' , price);
        formData.append('stock' , stock);
        formData.append('description' , description);
        formData.append('seller' , seller);
        formData.append('category' , category);
        images.forEach (image => {
            formData.append('images', image)
        })
        dispatch(createNewProduct(formData))
    }


    useEffect(() => {

        if(isProductCreated) {

            toast.success('Product created SuccessFully',{
                position:"bottom-center",
                onOpen:()=>dispatch(clearProductCreated())
            })
            navigate('/admin/products')
            return;
        }

        if(error)  {
            toast.error(error, {
                position:"bottom-center",
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }
    }, [isProductCreated, error, dispatch])


    
    
  return (
    <div className='row'>
          <div className='col-12 col-md-2'>
              <SideBar/>
          </div>
          <div className='col-12 col-md-10'>
            <Fragment>
            <div className="wrapper my-5"> 
               <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                <h1 className="mb-4">New Product</h1>

                <div className="form-group">
                <label for="name_field">Name</label>
                <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    value={name}
                    onChange={e=>setName(e.target.value)}
                />
                </div>

                <div className="form-group">
                    <label for="price_field">Price</label>
                    <input
                    type="text"
                    id="price_field"
                    className="form-control"
                    value={price}
                    onChange={e=>setPrice(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label for="description_field">Description</label>
                    <textarea 
                       className="form-control" 
                       id="description_field" 
                       rows="8" 
                       onChange={e=>setDescription(e.target.value)}
                       value={description}
                       ></textarea>
                </div>

                <div className="form-group">
                    <label for="category_field">Category</label>
                    <select onChange={e=>setCategory(e.target.value)} className="form-control" id="category_field">
                        <option>select</option>
                        {categories.map(category=>(
                            <option key={category} value={category} >{category}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label for="stock_field">Stock</label>
                    <input
                    type="number"
                    id="stock_field"
                    className="form-control"
                    value={stock}
                    onChange={e=>setStock(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label for="seller_field">Seller Name</label>
                    <input
                    type="text"
                    id="seller_field"
                    className="form-control"
                    value={seller}
                    onChange={e=>setSeller(e.target.value)}
                    />
                </div>
                
                <div className='form-group'>
                    <label>Images</label>
                    
                        <div className='custom-file'>
                            <input
                                type='file'
                                name='product_images'
                                className='custom-file-input'
                                id='customFile'
                                multiple
                                onChange={onImageChange}
                            />
                            <label className='custom-file-label' for='customFile'>
                                Choose Images
                            </label>
                </div>
                             {imagesPreview.map(image => (
                                        <img
                                            className="mt-3 mr-2"
                                            key={image}
                                            src={image}
                                            alt={`Image Preview`}
                                            width="55"
                                            height="52"
                                        />
                                    ))}
                </div>


                <button
                id="login_button"
                type="submit"
                className="btn btn-block py-3"
                disabled={loading}
                >
                CREATE
                </button>

                    </form>
                    </div>
                    </Fragment>
                </div>
            
            </div>
  )
}
