import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.scss';

import S404 from './sites/s404/s404';
import ScrumMasterView, {
  route as ScrumMasterViewRoute,
} from './sites/scrum_master_view/scrum_master_view';
import Login, { route as loginRoute } from './sites/login/login';
import EstimationView, {
  route as estimationViewRoute,
} from './sites/estimation-room/estimation-view';
import WaveImg from './assets/hero-wave1.svg';

// @ts-ignore
const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => (
      sessionStorage.getItem('user_id') ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
          pathname: '/',
            state: {from: props.location}
        }}/>
      )
    )}/>
);

function App() {
  return (
    <Router>
      <img
        className="wave"
        src={WaveImg}
        aria-hidden="true"
        alt="Wave image floating in the background."
      />
      <Switch>
        <Route exact path={loginRoute} component={Login} />
        <Route exact path={ScrumMasterViewRoute} component={ScrumMasterView} />
        <PrivateRoute exact path={estimationViewRoute} component={EstimationView} />
        <Route component={S404} />
      </Switch>
    </Router>
  );
}

export default App;
