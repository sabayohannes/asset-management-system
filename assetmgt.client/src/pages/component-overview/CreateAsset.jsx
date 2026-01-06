import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../../hooks/useNotifications/useNotifications';
import {
    createOne as createEmployee,
    validate as validateEmployee,
} from './data/employees';
import AssetForm from './AssetForm';
import PageContainer from './PageContainer';

const INITIAL_FORM_VALUES = {
    role: 'Market',
    isFullTime: true,
};

export default function CreateAsset() {
    const navigate = useNavigate();

    const notifications = useNotifications();

    

    const handleSuccess = () => {
        notifications.show('Asset created successfully.', {
            severity: 'success',
            autoHideDuration: 3000,
        });
        navigate('/assets'); // or wherever you want to go after success
    };

    const handleClose = () => {
        navigate(-1); // go back to the previous page
    };


    return (
        <PageContainer
            title="New Asset"
            breadcrumbs={[{ title: 'Asset', path: '/employees' }, { title: 'New' }]}
        >
            <AssetForm
             
                token={localStorage.getItem('token')} // or wherever your auth token is
                onSuccess={handleSuccess}
                onClose={handleClose}
            />
        </PageContainer>
    );
}
