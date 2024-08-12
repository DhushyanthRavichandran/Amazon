import React, { Fragment, useEffect, useState } from "react";
import MetaData from "./layouts/MetaData";
import { getProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./layouts/Loader";
import Products from "./product/Products";
import { toast } from "react-toastify";
import Pagination from 'react-js-pagination';
const Home = () => {
  const dispatch = useDispatch();
  const [currPage,setCurrPage]=useState(1)
  const { products ,count, postPerPage} = useSelector((state) => state.productsState);
  const { loading, error } = useSelector((state) => state.productsState);
  
const setCurrPageNo =(pageNo)=>{
  setCurrPage(pageNo)
}

  useEffect(() => {
    if (error)
      toast.error(error, {
        position: "bottom-center",
      });
    dispatch(getProducts(currPage));
  }, [dispatch,currPage]);
  console.log(currPage);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products"} />
          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => <Products key={product._id} product={product} />)}
            </div>
          </section>
          {count>0 && count>postPerPage ?
          
          <div className="d-flex   mt-5 justify-content-center">

          <Pagination
            activePage={currPage}
            onChange={setCurrPageNo}
            totalItemsCount={count}
            itemsCountPerPage={postPerPage}
            nextPageText={'Next'}
            firstPageText={'First'}
            lastPageText={'Last'}
            itemClass={'page-item'}
            linkClass={'page-link'}
          /></div>: null }
          
          
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
