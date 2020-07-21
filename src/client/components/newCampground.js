import React, { useEffect, useContext, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import useForm from '../hooks/useForm';
import useGetFileName from '../hooks/useGetFileName';
import useLoading from '../hooks/useLoading';
import LoadingButton from './loadingButton';


function NewCampground() {
  const { push } = useHistory();
  const {
    loggedInAs: {
      id: loggedInAsId
    }
  } = useContext(LoggedInAsContext);

  const initBtnMessage = 'Select Campground Image (Required)';
  const { imageFile, btnMessage, handleFileChange } = useGetFileName(initBtnMessage);

  const initData = {
    name: '',
    description: '',
    price: '',
  };
  const { values, handleChange } = useForm(initData);
  const {
    price, name, description
  } = values;

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  useEffect(() => {
    if (!localStorage.userId) {
      push('/login');
    }
  }, [push]);

  const cancelTokenRef = useRef();
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    }
  }, []);

  async function submitForm(event) {
    event.preventDefault();
    setLoadingTrue();
    cancelTokenRef.current = axios.CancelToken.source() 
    const priceNoDollarSign = price.replace(/\$/gi, '');
    const fd = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      cancelToken: cancelTokenRef.current.token
    };
    fd.append('image', imageFile);
    fd.append('name', name);
    fd.append('description', description);
    fd.append('campLocation', name);
    fd.append('price', priceNoDollarSign);
    fd.append('userId', loggedInAsId);
    const url = '/api/campgrounds';

    try {
      const {
        status,
        data: {
          message,
          id
        }
      } = await axios.post(url, fd, config);
      
      if (status === 201) {
        toast.success(message);
        toast.warning('Check that map displays correct location (if not click "Edit" to modify).', {delay: 4000, autoClose: 6000});
        toast('Be sure to rate/review your campground! 👇', {delay: 9000});
        push(`/campgrounds/${id}`);
      } else {
        const error = new Error();
        throw error;
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log(`axios call was cancelled`);
      } else {
        const { statusText } = err;
        const errMsg = statusText || err;
        toast.error(errMsg);
      }
    } finally {
      setLoadingFalse();
    }
  }

  return (
    <div className="margin-top-50 marginBtm">
      <Container>
        <h1 className="text-center color-dark-blue">Create a New <br className="brnodisplay-md" />Campground</h1>
        <br />
        <form onSubmit={submitForm}>
          <div className="entryBox centered flex flex-dir-col">
            <div className="form-group">
              <input
                className="form-control shadow-none"
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                value={name}
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-control shadow-none inputTextBox"
                type="text"
                name="description"
                placeholder="Description"
                rows="5"
                onChange={handleChange}
                value={description}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control shadow-none"
                type="text"
                name="price"
                placeholder="Price ($/night)"
                onChange={handleChange}
                value={price}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="file-upload"
                className="btn btn-outline-primary btn-block"
              >
                <input
                  id="file-upload"
                  type="file"
                  name="image"
                  data-multiple-caption={btnMessage}
                  onChange={handleFileChange}
                />
                <span>{btnMessage}</span>
              </label>
            </div>
            <br />
            <div className="form-group">
              <LoadingButton
                isLoading={loading}
                className="btn-block loading-button btn-orange btn-square shadow-none"
                variant="primary"
                type="submit"
                size="lg"
              >
                Submit
              </LoadingButton>
            </div>
            <Link to="/campgroundsHome">
              <Button
                size="sm"
                variant="link"
                className="float-left go-back-btn"
              >
                Go Back
              </Button>
            </Link>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default NewCampground;
