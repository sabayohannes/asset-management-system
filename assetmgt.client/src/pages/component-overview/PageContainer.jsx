'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Link } from 'react-router';

const PageContentHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
}));

const PageHeaderBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: (theme.vars || theme).palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: 'center',
    },
}));

const PageHeaderToolbar = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    marginLeft: 'auto',
}));

function PageContainer({
    children,
    breadcrumbs = [],
    title,
    actions = null,
    titleTypographyProps = {},
    breadcrumbTypographyProps = {},
}) {
    const filteredBreadcrumbs = breadcrumbs.filter(
        (b, idx) => !(b.title === title && idx === breadcrumbs.length - 1)
    );

    return (
        <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Stack sx={{ flex: 1, my: 2 }} spacing={2}>
                <Stack>
                    <PageHeaderBreadcrumbs
                        aria-label="breadcrumb"
                        separator={<NavigateNextRoundedIcon fontSize="small" />}
                    >
                        {filteredBreadcrumbs.map((breadcrumb, index) =>
                            breadcrumb.path ? (
                                <MuiLink
                                    key={index}
                                    component={Link}
                                    underline="hover"
                                    color="inherit"
                                    to={breadcrumb.path}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 500 }}
                                        {...breadcrumbTypographyProps}
                                    >
                                        {breadcrumb.title}
                                    </Typography>
                                </MuiLink>
                            ) : (
                                <Typography
                                    key={index}
                                    variant="body2"
                                    sx={{ color: 'text.primary', fontWeight: 600 }}
                                    {...breadcrumbTypographyProps}
                                >
                                    {breadcrumb.title}
                                </Typography>
                            )
                        )}
                    </PageHeaderBreadcrumbs>

                    <PageContentHeader>
                        {title && (
                            <Typography
                                variant="h4"
                                sx={{ fontWeight: 600 }}
                                {...titleTypographyProps}
                            >
                                {title}
                            </Typography>
                        )}
                        <PageHeaderToolbar>{actions}</PageHeaderToolbar>
                    </PageContentHeader>
                </Stack>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {children}
                </Box>
            </Stack>
        </Container>
    );
}


PageContainer.propTypes = {
    actions: PropTypes.node,
    breadcrumbs: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string,
            title: PropTypes.string.isRequired,
        })
    ),
    children: PropTypes.node,
    title: PropTypes.string,
};

export default PageContainer;
