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

function AssetForm(props) {
    const [formValues, setFormValues] = React.useState({
        name: '',
        serialNumber: '',
        purchaseDate: '',
        category: '',
        isFullTime: false,
    });

    const [formErrors, setFormErrors] = React.useState({
        name: '',
        serialNumber: '',
        purchaseDate: '',
        category: '',
        isFullTime: '',
    });


  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (event) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

    const handleTextFieldChange = (event) => {
        setFormValues((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleNumberFieldChange = (event) => {
        setFormValues((prev) => ({
            ...prev,
            [event.target.name]: Number(event.target.value),
        }));
    };
    const handleSelectFieldChange = (event) => {
        setFormValues((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

  const handleCheckboxFieldChange = React.useCallback(
    (event, checked) => {
      onFieldChange(event.target.name, checked);
    },
    [onFieldChange],
  );

    const handleDateFieldChange = (fieldName) => (value) => {
        setFormValues((prev) => ({
            ...prev,
            [fieldName]: value?.isValid() ? value.toISOString() : '',
        }));
    };


 
  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/employees');
  }, [navigate, backButtonPath]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
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
             value={formValues.SerialNumber ?? ''}
             onChange={handleNumberFieldChange}
             name="SerialNumber"
             label="SerialNumber"
             error={!!formErrors.SerialNumber}
             helperText={formErrors.SerialNumber ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
               value={formValues.joinDate ? dayjs(formValues.joinDate) : null}
               onChange={handleDateFieldChange('PurchaseDate')}
               name="PurchaseDate"
               label="PurchaseDate"
                slotProps={{
                  textField: {
                        error: !!formErrors.PurchaseDate,
                        helperText: formErrors.PurchaseDate ?? ' ',
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
           <FormControl error={!!formErrors.Category} fullWidth>
             <InputLabel id="asset-Category-label">Category</InputLabel>
              <Select
                value={formValues.Category ?? ''}
                onChange={handleSelectFieldChange}
                labelId="asset-Category-label"
                name="Category"
                label="Category"
                defaultValue=""
                fullWidth
              >
                <MenuItem value="Market">software</MenuItem>
                <MenuItem value="Finance">hardware</MenuItem>
                <MenuItem value="Development">other</MenuItem>
              </Select>
                          <FormHelperText>{formErrors.Category ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormControlLabel
                name="isFullTime"
                control={
                  <Checkbox
                    size="large"
                    checked={formValues.isFullTime ?? false}
                    onChange={handleCheckboxFieldChange}
                  />
                }
                label="Full-time"
              />
              <FormHelperText error={!!formErrors.isFullTime}>
                {formErrors.isFullTime ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}

AssetForm.propTypes = {
    backButtonPath: PropTypes.string,
    formState: PropTypes.shape({
        errors: PropTypes.shape({
            name: PropTypes.string,
            serialNumber: PropTypes.string,
            purchaseDate: PropTypes.string,
            category: PropTypes.string,
            isFullTime: PropTypes.string,
        }).isRequired,
        values: PropTypes.shape({
            name: PropTypes.string,
            serialNumber: PropTypes.string,
            purchaseDate: PropTypes.string,
            category: PropTypes.string,
            isFullTime: PropTypes.bool,
        }).isRequired,
    }).isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onReset: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    submitButtonLabel: PropTypes.string.isRequired,
};

export default AssetForm;
