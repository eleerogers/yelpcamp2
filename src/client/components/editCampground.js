import React, { useEffect, useRef, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import useForm from '../hooks/useForm';
import useGetFileName from '../hooks/useGetFileName';
import '../app.css';

function EditCampground() {
  const {
    loggedInAs: {
      admin,
      id: loggedInAsId
    }
  } = useContext(LoggedInAsContext);
  const {
    location: {
      state: {
        campground
      }
    },
    push
  } = useHistory();

  const initBtnMessage = 'Change Campground Image';
  const { imageFile, btnMessage, handleFileChange } = useGetFileName(initBtnMessage);

  const { values, handleChange } = useForm(campground);
  const {
    name,
    image,
    image_id: imageId,
    description,
    price,
    id: campgroundId,
    user_id: userId,
    location
  } = values;

  const nameRef = useRef(name);

  useEffect(() => {
    if (loggedInAsId === '') {
      push('/campgroundsHome');
    }
  }, [loggedInAsId, push]);

  async function submitForm(event) {
    event.preventDefault();
    const priceNoDollarSign = price.replace(/\$/gi, '');
    const fd = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    if (imageFile) {
      fd.append('image', imageFile);
    } else {
      fd.append('image', image);
    }
    fd.append('imageId', imageId);
    fd.append('name', name);
    fd.append('description', description);
    fd.append('campLocation', location);
    fd.append('price', priceNoDollarSign);
    fd.append('userId', userId);
    fd.append('adminBool', admin);
    const url = `/api/campgrounds/${campgroundId}`;

    try {
      const {
        status,
        data: {
          campground: updatedCampground,
          message: putResponseMsg
        }
      } = await axios.put(url, fd, config);
      if (status === 200) {
        toast.success(putResponseMsg);
        push({
          pathname: `/campgrounds/${campgroundId}`,
          state: {
            campground: updatedCampground,
          }
        });
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
    }
  }

  return (
    <div className="margin-top-50">
      <Container>
        <h1 className="text-center">
          Edit Campground:
          {' '}
          {nameRef.current}
        </h1>
        <br />
        <form onSubmit={submitForm}>
          <div className="entryBox centered">
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                value={name}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="description"
                placeholder="Description"
                onChange={handleChange}
                value={description}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="location"
                placeholder="Location"
                onChange={handleChange}
                value={location}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
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
              <Button
                className="btn-block"
                variant="primary"
                type="submit"
                size="lg"
              >
                Submit
              </Button>
            </div>
            <Link to={{
              pathname: `/campgrounds/${campgroundId}`,
              state: {
                campground
              }
            }}
            >
              <Button
                size="sm"
                variant="link"
                className="marginBtm float-left"
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

export default EditCampground;
