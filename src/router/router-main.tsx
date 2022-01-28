import {HashRouter} from 'react-router-dom';


export const RouterMain = ({
                               children

                           }: any) => {

    return (
        <HashRouter basename={'h/'}>


            {
                children
            }
        </HashRouter>
    )

}

