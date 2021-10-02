import React from 'react'
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    headerText: {
        fontSize: theme.typography.h1.fontSize,
        margin: theme.typography.h1.marginTop,
        padding: '5px',

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    carIcon: {
        marginTop: '10px',
        fontSize: theme.typography.h1.fontSize,

    }
}));


export const OrderCar = () => {
    const classes = useStyles();
    return (

        <div></div>


    )

}
