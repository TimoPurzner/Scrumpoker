import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  Redirect,
} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
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
import { Fragment } from 'react';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Redirect to={loginRoute} />
        </Route>
        <Route path='*'>
          <AnimationApp />
        </Route>
      </Switch>
    </Router>
  );
}

function AnimationApp() {
  let location = useLocation();

  return (
    <Fragment>
      <img
        className='wave'
        src={WaveImg}
        aria-hidden='true'
        alt='Wave image floating in the background.'
      />
      <TransitionGroup>
        {/*
            This is no different than other usage of
            <CSSTransition>, just make sure to pass
            `location` to `Switch` so it can match
            the old location as it animates out.
          */}
        <CSSTransition
          key={location.key}
          classNames='fade'
          timeout={{ enter: 0, exit: 0 }}
        >
          <Switch>
            <Route exact path={loginRoute} component={Login} />
            <Route
              exact
              path={ScrumMasterViewRoute}
              component={ScrumMasterView}
            />
            <Route
              exact
              path={estimationViewRoute}
              component={EstimationView}
            />
            <Route component={S404} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </Fragment>
  );
}

export default App;
