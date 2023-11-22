import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InputField } from '../../components/InputField';
import classNames from 'classnames';
import './LoginPage.scss';

export const LoginPage = ({ setToken, token }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [group, setGroup] = useState('');
  const [faculty, setFaculty] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(''), 2000);
    }
  }, [errorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (username.trim() && password.trim()) {
      let url;
      let body = {
        username,
        password,
        fullname,
        group,
        phone,
        faculty,
        city,
      };
      let method = 'POST';

      switch (searchParams.get('mode')) {
        case 'signup': {
          url = 'http://localhost:5000/users/signup';
          break;
        }

        case 'update': {
          url = `http://localhost:5000/users/${searchParams.get('userId')}`;
          method = 'PUT'
          break;
        }

        case 'login':
        default: {
          url = 'http://localhost:5000/users/login';
          body = {
            username,
            password,
          };
          break;
        }
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      })
        .then(result => result.json());

      if (response.message) {
        setErrorMessage(response.message);
      } else {
        if (response.token) {
          setToken(response.token);
        }
        navigate('/info');
      }
    } else {
      setErrorMessage('Please, enter name and password');
    }
  }

  const handleModeButton = (e) => {
    if (searchParams.get('mode') === 'signup') {
      setSearchParams({ mode: 'login' });
    } else {
      setSearchParams({ mode: 'signup' });
    }
  }

  return (
    <div className="LoginPage">
      <h2 className="LoginPage__header">
        {!searchParams.get('mode')
          ? 'Login'
          : searchParams.get('mode')[0].toUpperCase() + searchParams.get('mode').slice(1)}
      </h2>
      <form className="LoginPage__form form-login" onSubmit={handleSubmit}>
        <InputField
          currentvalue={username}
          setValue={setUsername}
          placeholder="Username"
        />

        <InputField
          currentvalue={password}
          setValue={setPassword}
          type="password"
          placeholder="Password"
        />
        {(searchParams.get('mode') === 'signup' || searchParams.get('mode') === 'update') && (
          <>
            <InputField
              currentvalue={fullname}
              setValue={setFullname}
              placeholder="Johnson J. J."
            />

            <InputField
              currentvalue={group}
              setValue={setGroup}
              placeholder="XX-11"
            />

            <InputField
              currentvalue={phone}
              setValue={setPhone}
              placeholder="(098)-111-11-11"
            />

            <InputField
              currentvalue={faculty}
              setValue={setFaculty}
              placeholder="FICE"
            />

            <InputField
              currentvalue={city}
              setValue={setCity}
              placeholder="Kyiv"
            />
          </>
        )}
        <button className="form-login__button form-login__button--accept">
          Accept
        </button>

        {searchParams.get('mode') !== 'update' && (
          <button
            type='button'
            className="form-login__button form-login__button--signup"
            onClick={handleModeButton}
          >
            {searchParams.get('mode') !== 'signup'
              ? 'Sign up'
              : 'Back to login'
            }
          </button>
        )}
      </form>

      <div className={classNames(
        "LoginPage__error",
        { "hidden": !errorMessage }
      )}>
        {errorMessage}
      </div>
    </div>
  );
}