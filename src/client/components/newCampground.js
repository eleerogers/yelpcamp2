import React, { useEffect, useContext } from 'react';
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
    campLocation: '',
    price: '',
  };
  const { values, handleChange } = useForm(initData);
  const {
    price, name, description, campLocation
  } = values;

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  useEffect(() => {
    if (!localStorage.userId) {
      push('/login');
    }
  }, [push]);

  async function submitForm(event) {
    event.preventDefault();
    setLoadingTrue();
    const priceNoDollarSign = price.replace(/\$/gi, '');
    const fd = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    fd.append('image', imageFile);
    fd.append('name', name);
    fd.append('description', description);
    fd.append('campLocation', campLocation);
    fd.append('price', priceNoDollarSign);
    fd.append('userId', loggedInAsId);
    const url = '/api/campgrounds';

    try {
      const { status, data } = await axios.post(url, fd, config);
      if (status === 201) {
        toast.success(data);
        push('/campgroundsHome');
      } else {
        const error = new Error();
        error.response = {
          status: 400,
          data: 'Unsuccessful request'
        };
        throw error;
      }
    } catch (err) {
      const {
        response: {
          status,
          data
        }
      } = err;
      toast.error(`${data} (${status})`);
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
          <div className="entryBox centered">
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
                name="campLocation"
                placeholder="Location"
                onChange={handleChange}
                value={campLocation}
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
                className="float-left text-primary text-primary-hover"
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
