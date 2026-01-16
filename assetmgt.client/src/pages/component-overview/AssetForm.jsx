import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import axios from 'axios'
function AssetForm({ token, asset, onSuccess, onClose }) {
    const [formValues, setFormValues] = React.useState({
        name: asset?.name || '',
        category: asset?.category || '',
        serialNumber: asset?.serialNumber || '',
        purchaseDate: asset?.purchaseDate
            ? asset.purchaseDate.split('T')[0]
            : '',
        image: null,
    });
    // This ensures that when the asset data is loaded from the API, 
    // the form fields update immediately.
    React.useEffect(() => {
        if (asset) {
            setFormValues({
                name: asset.name || '',
                category: asset.category || '',
                serialNumber: asset.serialNumber || '',
                purchaseDate: asset.purchaseDate
                    ? asset.purchaseDate.split('T')[0]
                    : '',
                image: null,
            });
        }
    }, [asset]);

    const [formErrors, setFormErrors] = React.useState({
        name: '',
        serialNumber: '',
        purchaseDate: '',
        category: '',
        isFullTime: '',
    });


  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', formValues.name);
        formData.append('category', formValues.category);
        formData.append('serialNumber', formValues.serialNumber);
        formData.append('purchaseDate', formValues.purchaseDate);

        if (formValues.image instanceof File) {
            formData.append('Image', formValues.image);
        }

        try {
            if (asset) {
                await axios.put(
                    `http://localhost:5001/api/assets/${asset.id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                await axios.post(
                    'http://localhost:5001/api/assets/assetregister',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            onSuccess();
            if (onClose) onClose();
        } catch (err) {
            console.error('Asset save error:', err);
        }
    };

    const handleTextFieldChange = (event) => {
        setFormValues((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleNumberFieldChange = (event) => {
        setFormValues((prev) => ({
            ...prev,
            [event.target.name]: (event.target.value),
        }));
    };
    const handleSelectFieldChange = (event) => {
        setFormValues((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };


    const handleDateFieldChange = (value) => {
        setFormValues((prev) => ({
            ...prev,
            purchaseDate: value ? value.format('YYYY-MM-DD') : '',
        }));
    };


 
  

    const handleBack = () => {
        navigate(-1);
    };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      sx={{ width: '100%' }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.name ?? ''}
              onChange={handleTextFieldChange}
              name="name"
              label="Asset Name"
              error={!!formErrors.name}
              helperText={formErrors.name ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
             type="number"
             value={formValues.serialNumber ?? ''}
             onChange={handleNumberFieldChange}
             name="serialNumber"
             label="SerialNumber"
             error={!!formErrors.serialNumber}
             helperText={formErrors.serialNumber ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                              label="Purchase Date"
                              value={formValues.purchaseDate ? dayjs(formValues.purchaseDate) : null}
                              onChange={handleDateFieldChange}
                          />

            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
           <FormControl error={!!formErrors.category} fullWidth>
             <InputLabel id="asset-Category-label">Category</InputLabel>
              <Select
                value={formValues.category ?? ''}
                onChange={handleSelectFieldChange}
                labelId="asset-Category-label"
                name="category"
                label="Category"
                defaultValue=""
                fullWidth
              >
                <MenuItem value="Market">software</MenuItem>
                <MenuItem value="Finance">hardware</MenuItem>
                <MenuItem value="Development">other</MenuItem>
              </Select>
                          <FormHelperText>{formErrors.category ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
            
                          <Box mt={2}>
                              <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                      setFormValues((prev) => ({
                                          ...prev,
                                          image: e.target.files[0],
                                      }))
                                  }
                              />
                          </Box>
              <FormHelperText error={!!formErrors.isFullTime}>
                {formErrors.isFullTime ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/assetreview')}
                  sx={{ mb: 3, textTransform: 'none', fontWeight: 600 }}
              >
                  Back to List
              </Button>
              <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
              >
                  {asset ? 'Update Asset' : 'Add Asset'}
              </Button>

      </Stack>
    </Box>
  );
}

AssetForm.propTypes = {
    token: PropTypes.string.isRequired,
    asset: PropTypes.object,
    onSuccess: PropTypes.func.isRequired,
    onClose: PropTypes.func,
};


export default AssetForm;
