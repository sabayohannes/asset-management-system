import * as React from 'react';

import PropTypes from 'prop-types';

import Alert from '@mui/material/Alert';

import Box from '@mui/material/Box';

import CircularProgress from '@mui/material/CircularProgress';

import { useNavigate, useParams } from 'react-router';

import useNotifications from '../../hooks/useNotifications/useNotifications';

import { getOne as getAsset, updateOne as updateAsset, validate as validateAsset } from '../../data/assets';



import AssetForm from './AssetForm'; // <- your asset form

import PageContainer from './PageContainer';



function AssetEditForm({ initialValues, onSubmit }) {

    const { assetId } = useParams();

    const navigate = useNavigate();

    const notifications = useNotifications();



    const [formState, setFormState] = React.useState(() => ({

        values: initialValues,

        errors: {},

    }));



    const formValues = formState.values;

    const formErrors = formState.errors;



    const setFormValues = React.useCallback((newFormValues) => {

        setFormState((prev) => ({

            ...prev,

            values: newFormValues,

        }));

    }, []);



    const setFormErrors = React.useCallback((newFormErrors) => {

        setFormState((prev) => ({

            ...prev,

            errors: newFormErrors,

        }));

    }, []);



    const handleFormFieldChange = React.useCallback(

        (name, value) => {

            const validateField = async (values) => {

                const { issues } = validateAsset(values);

                setFormErrors({

                    ...formErrors,

                    [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,

                });

            };



            const newFormValues = { ...formValues, [name]: value };



            setFormValues(newFormValues);

            validateField(newFormValues);

        },

        [formValues, formErrors, setFormErrors, setFormValues],

    );



    const handleFormReset = React.useCallback(() => {

        setFormValues(initialValues);

    }, [initialValues, setFormValues]);



    const handleFormSubmit = React.useCallback(async () => {

        const { issues } = validateAsset(formValues);

        if (issues && issues.length > 0) {

            setFormErrors(

                Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),

            );

            return;

        }

        setFormErrors({});



        try {

            await onSubmit(formValues);

            notifications.show('Asset edited successfully.', {

                severity: 'success',

                autoHideDuration: 3000,

            });



            navigate('/assets'); // <- redirect to asset list

        } catch (editError) {

            notifications.show(`Failed to edit asset. Reason: ${editError.message}`, {

                severity: 'error',

                autoHideDuration: 3000,

            });

            throw editError;

        }

    }, [formValues, navigate, notifications, onSubmit, setFormErrors]);



    return (

        <AssetForm

            asset={formState.values}       // The values from the parent state
            onFieldChange={handleFormFieldChange} // Pass the parent's handler
            onSuccess={() => navigate('/assets')}
            submitButtonLabel="Save"
            backButtonPath={`/assets/${assetId}`}

        />

    );

}



AssetEditForm.propTypes = {

    initialValues: PropTypes.object.isRequired,

    onSubmit: PropTypes.func.isRequired,

};



export default function AssetEdit() {

    const { assetId } = useParams();



    const [asset, setAsset] = React.useState(null);

    const [isLoading, setIsLoading] = React.useState(true);

    const [error, setError] = React.useState(null);



    const loadData = React.useCallback(async () => {

        setError(null);

        setIsLoading(true);



        try {

            const showData = await getAsset(Number(assetId));

            setAsset(showData);

        } catch (showDataError) {

            setError(showDataError);

        }

        setIsLoading(false);

    }, [assetId]);



    React.useEffect(() => {

        loadData();

    }, [loadData]);



    const handleSubmit = React.useCallback(

        async (formValues) => {

            const updatedData = await updateAsset(Number(assetId), formValues);

            setAsset(updatedData);

        },

        [assetId],

    );



    const renderEdit = React.useMemo(() => {

        if (isLoading) {

            return (

                <Box

                    sx={{

                        flex: 1,

                        display: 'flex',

                        flexDirection: 'column',

                        alignItems: 'center',

                        justifyContent: 'center',

                        width: '100%',

                        m: 1,

                    }}

                >

                    <CircularProgress />

                </Box>

            );

        }

        if (error) {

            return (

                <Box sx={{ flexGrow: 1 }}>

                    <Alert severity="error">{error.message}</Alert>

                </Box>

            );

        }



        return asset ? (

            <AssetEditForm initialValues={asset} onSubmit={handleSubmit} />

        ) : null;

    }, [isLoading, error, asset, handleSubmit]);



    return (

        <PageContainer

            title={`Edit Asset ${assetId}`}

            breadcrumbs={[

                { title: 'Assets', path: '/assets' },

                { title: `Asset ${assetId}`, path: `/assets/${assetId}` },

                { title: 'Edit' },

            ]}

        >

            <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>

        </PageContainer>

    );

}