import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

type Error = {
  title: string;
  content: string;
};

interface ErrorHandlerProps {
  redirectUrl: string;
  error: Error;
  resetError: () => void;
}

const MyContentDialog = ({ error, handleError }) => {
  return (
    <Modal show onHide={handleError}>
      <Modal.Header closeButton>
        <Modal.Title>{error.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{error.content}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleError}>
          Close
        </Button>
        <Button variant="primary" onClick={handleError}>
          Redirect back
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default function ErrorHandler({
                                       redirectUrl,
                                       error,
                                       resetError
                                     }: ErrorHandlerProps) {
  const [redirect, setRedirect] = useState(false);

  const handleError = () => {
    setRedirect(true);
    resetError();
  };

  return (
    <>
      {redirect && <Redirect exact to={`${redirectUrl}`} />}
      {!redirect && (
        <div>
          <MyContentDialog error={error} handleError={handleError} />
        </div>
      )}
    </>
  );
}
