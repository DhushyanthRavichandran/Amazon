import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layouts/MetaData";
import { getProducts } from "../../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layouts/Loader";
import Products from "../product/Products";
import { toast } from "react-toastify";
import Pagination from 'react-js-pagination';
import { useParams } from "react-router-dom";
import Slider from "rc-slider";
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const ProductSearch = () => {
  const dispatch = useDispatch();
  
  const { products, totalCount, postPerPage } = useSelector((state) => state.productsState);
  const { loading, error } = useSelector((state) => state.productsState);
  
  const [currPage, setCurrPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);
  const [category, setCategory] = useState(null);
  const [priceChanged, setPriceChanged] = useState(price);
  const [rating, setRating] = useState(0);
  const { keyword } = useParams();
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
const handleCategoryClick = (category) => {
  setCategory(category);
};
  
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-center" });
    }
    dispatch(getProducts(currPage, keyword, priceChanged,category,rating));
  }, [error,dispatch, currPage, keyword, priceChanged,category,rating]);

  const handlePageChange = (pageNo) => {
    setCurrPage(pageNo);
  };


  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products"} />
          <h1 id="products_heading">Search Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              <div className="col-6 col-md-3 mb-3 mt-5">
              <h4 className="mb-1">price</h4>
                {/* Price Filter */}
                <div className="px-5" onMouseUp={()=>setPriceChanged(price)}>
                  <Slider
                    range={true }
                    marks={{ 1: "$1", 1000: "$1000" }}
                    min={1}
                    max={1000}
                    defaultValue={price}
                    onChange={(price)=>{
                      setPrice(price)
                  }}
                  handleRender={
                    renderProps => {
                        return (
                            <Tooltip  overlay={`$${renderProps.props['aria-valuenow']}`}  >
                                 <div {...renderProps.props}>  </div>
                            </Tooltip>
                        )
                    }
                }
            />
                </div>
                <hr className="my-5" />
                  {/* Price Filter */}
                <div className="mt-5">
           
                  <h3 className="mb-3" >Categories</h3>
                  <ul className="p-0">
                    {categories.map(cat => (
                      <li
                        style={{ cursor: "pointer", listStyleType: "none" }}
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
                <hr className="my-5" />
                {/* Ratings Filter */}
                <div className="mt-5">
                  <h4 className="mb-3">Ratings</h4>
                  <ul className="pl-0">
                    {[5, 4, 3, 2, 1].map(star => (
                      <li
                        style={{ cursor: "pointer", listStyleType: "none" }}
                        key={star}
                        onClick={() => setRating(star)}
                      >
                        <div className="rating-outer">
                          <div
                            className="rating-inner"
                            style={{ width: `${star * 20}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-6 col-md-9">
                <div className="row">
                  {products &&
                    products.map(product => <Products col={4} key={product._id} product={product} />)}
                </div>
              </div>
            </div>
          </section>

          {totalCount > postPerPage && (
            <div className="d-flex  mt-5 justify-content-center">
              <Pagination
                activePage={currPage}
                onChange={handlePageChange}
                totalItemsCount={totalCount}
                itemsCountPerPage={postPerPage}
                nextPageText={'Next'}
                firstPageText={'First'}
                lastPageText={'Last'}
                itemClass={'page-item'}
                linkClass={'page-link'}
           />     
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductSearch;
