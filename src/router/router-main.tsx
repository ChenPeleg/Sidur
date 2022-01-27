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

// You can think of these components as "pages"
// in your app.

function Home() {
    return (
        <div>
            <h2>Home</h2>
        </div>
    );
}

function About() {
    return (
        <div>
            <h2>About</h2>
        </div>
    );
}

function Dashboard() {
    return (
        <div>
            <h2>Dashboard</h2>
        </div>
    );
}
