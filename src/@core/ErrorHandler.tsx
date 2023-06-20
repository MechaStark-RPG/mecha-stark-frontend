import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { ContentDialog } from 'react-uwp';

type Error = {
    title: string;
    content: string;
};

interface ErrorHandlerProps {
    redirectUrl: string;
    error: Error;
    resetError: () => void;
}

export default function ErrorHandler({
    redirectUrl,
    error,
    resetError,
}: ErrorHandlerProps) {
    const [redirect, setRedirect] = useState(false);
    /**
     * Render Error modal
     * Received props -> redirectUrl  string       - URL to redirect to, after processing error
     *                -> error        Object       - Topic and Message for the error
     *                -> resetError   function     - Reset Error state on parent component
     */

    const handleError = () => {
        setRedirect(true);
        resetError();
    };

    return (
        <>
            {redirect && <Redirect exact to={`${redirectUrl}`} />}
            {!redirect && (
                <div>
                    <ContentDialog
                        title={`${error.title}`}
                        content={`${error.content}`}
                        primaryButtonAction={() => handleError()}
                        closeButtonAction={() => handleError()}
                        primaryButtonText="Redirect back"
                        secondaryButtonText={null}
                        onCloseDialog={() => {
                            handleError();
                        }}
                    />
                </div>
            )}
        </>
    );
}
