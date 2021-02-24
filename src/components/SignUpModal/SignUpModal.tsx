import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Input, Modal } from 'semantic-ui-react';
import { registerUser } from '../../services/user';
import { UPDATE_CURRENT_USER } from '../../store/types';
import styles from './SignUpModal.module.scss';

type Props = {
  isOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
};

const SignUpModal = (props: Props) => {
  const dispatch = useDispatch();
  const { isOpen, setModalOpen } = props;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);
  const handleEmailChange = useCallback((event) => {
    setEmail(event.target.value);
  }, []);
  const handlePasswordChange = useCallback((event) => {
    setPassword(event.target.value);
  }, []);
  const handleSignUpClick = useCallback(() => {
    registerUser({
      data: {
        username: username,
        email: email,
        password: password,
      },
    })
      .then((response) => {
        localStorage.setItem('username', email);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('authToken', response.data.token);
        dispatch({ type: UPDATE_CURRENT_USER, payload: { email: email, username: username } });
        setModalOpen(false);
      })
      .catch((error) => {
        setErrorModalOpen(true);
      });
  }, [email, username, password, dispatch, setModalOpen]);

  return (
    <Modal
      className={styles['modal']}
      onClose={() => props.setModalOpen(false)}
      onOpen={() => props.setModalOpen(true)}
      open={isOpen}
      closeIcon
      size="mini"
    >
      <Modal.Header className={styles['modal-header']}>Sign up to Digital Kampung</Modal.Header>
      <Modal.Content className={styles['modal-content']}>
        <Input className={styles['input-field']} placeholder="Username" value={username} onChange={handleUsernameChange} />
        <Input className={styles['input-field']} placeholder="Email" value={email} onChange={handleEmailChange} />
        <Input className={styles['input-field']} placeholder="Password" type="password" value={password} onChange={handlePasswordChange} />
        <Button className={styles['signup-button']} onClick={handleSignUpClick}>
          Sign up
        </Button>
      </Modal.Content>
      <Modal
        basic
        className={styles['login-modal']}
        onClose={() => setErrorModalOpen(false)}
        onOpen={() => setErrorModalOpen(true)}
        open={errorModalOpen}
        content="Sign up failed. The same email may have already been registered."
        actions={['Ok']}
      />
    </Modal>
  );
};

export default SignUpModal;
