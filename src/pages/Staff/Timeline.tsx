import React from 'react';
import { Stepper, Step, StepLabel, CircularProgress, styled, StepConnector, StepConnectorProps } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { stepConnectorClasses } from '@mui/material/StepConnector';

interface ProgressTimelineProps {
    currentStatus: string;
}

// Extend StepConnectorProps to include isCancelled
interface CustomStepConnectorProps extends StepConnectorProps {
    isCancelled?: boolean;
}

const statusSteps = ['PENDING', 'CONFIRM', 'ON_GOING', 'CHECKED_IN', 'DONE'];

// Styled connector for the stepper
const QontoConnector = styled(StepConnector)<CustomStepConnectorProps>(({ theme, isCancelled }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: isCancelled ? 'red' : '#4caf50',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: isCancelled ? 'red' : '#4caf50',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: isCancelled ? 'red' : '#818c81', // Red for canceled, otherwise gray
        borderTopWidth: 3,
        borderRadius: 1,
        ...theme.applyStyles('dark', {
            borderColor: theme.palette.grey[800],
        }),
    },
}));

// Styled empty circle component
const EmptyCircle = styled('div')(({ theme }) => ({
    width: 24,
    height: 24,
    borderRadius: '50%',
    border: '2px solid #818c81', // Border color for the empty circle
    backgroundColor: 'transparent',
}));

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ currentStatus }) => {
    const isCancelled = currentStatus === 'CANCELED';
    const stepIndex = isCancelled ? statusSteps.length : statusSteps.indexOf(currentStatus);

    return (
        <Stepper activeStep={stepIndex >= 0 ? stepIndex : -1} alternativeLabel connector={<QontoConnector isCancelled={isCancelled} />}>
            {statusSteps.map((status, index) => {
                let icon: React.ReactNode;
                let iconColor = 'inherit'; // Default color for the icon and label

                // Set icon for CANCELED status
                if (isCancelled) {
                    icon = <Cancel  style={{fontSize: 26 }}/>;
                    iconColor = 'red'; // Color for CANCELED status
                }
                // Set icon for completed steps
                else if (index < stepIndex || (currentStatus === 'DONE' && index === stepIndex)) {
                    icon = <CheckCircle style={{ color: '#4caf50', fontSize: 26 }} />;
                    iconColor = '#4caf50'; // Color for completed steps
                }
                // Set spinner for both PENDING and ON_GOING statuses
                else if (status === 'PENDING' || (currentStatus === 'ON_GOING' && status === 'ON_GOING')) {
                    icon = <CircularProgress size={24} color="warning" />;
                    iconColor = '#ff9800'; // Color for PENDING status
                }
                // Use the empty circle for all other statuses
                else {
                    icon = <EmptyCircle />;
                }

                return (
                    <Step key={status}>
                        <StepLabel
                            sx={{
                                '& .MuiStepLabel-iconContainer': {
                                    color: iconColor,
                                },
                                '& .MuiStepLabel-label': {
                                    color: iconColor,
                                },
                            }}
                            StepIconComponent={() => (
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    {icon}
                                </span>
                            )}
                        >
                            {status.replace('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
                        </StepLabel>
                    </Step>
                );
            })}
            {/* Add a final step for CANCELLED if currentStatus is CANCELED */}
            {isCancelled && (
                <Step key="CANCELLED">
                    <StepLabel
                        sx={{
                            '& .MuiStepLabel-iconContainer': {
                                color: 'red',
                            },
                            '& .MuiStepLabel-label': {
                                color: 'red',
                            },
                        }}
                        StepIconComponent={() => (
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <Cancel style={{ color: 'red', fontSize: 26  }} />
                            </span>
                        )}
                    >
                        Cancelled
                    </StepLabel>
                </Step>
            )}
        </Stepper>
    );
};

export default ProgressTimeline;
