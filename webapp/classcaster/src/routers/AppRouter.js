import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import CoursePage from "../components/CoursePage";
import Dashboard from "../components/Dashboard";
import LogInPage from "../components/LogInPage";
import LogOutPage from "../components/LogOutPage";
import NotFound from "../components/NotFound";
import { useToast } from "@chakra-ui/toast";

// export const history = createBrowserHistory();

const RouteListener = () => {
  let location = useLocation();
  const toast = useToast();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("_msg")) {
      toast({
        title: params.get("_title") ?? "ClassCaster Alert",
        description: params.get("_msg"),
        status: params.get("_status") ?? "success",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [location, toast]);
  return <></>;
};

const AppRouter = () => {
  return (
    <Router>
      <div>
        <RouteListener />
        <Switch>
          <Route path="/" exact component={LogInPage} />
          <Route path="/login" exact component={LogInPage} />
          <Route path="/dashboard" exact component={Dashboard} />
          <Route path="/logout" exact component={LogOutPage} />
          <Route path = "/course/:id" exact component = {CoursePage}/>
          {/**
            <PrivateRoute path = "/students/edit/:id" component={EditStudentContact} />
            <PrivateRoute path = "/students/content/:id" component = {StudentPersonalPage}/> */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
};

export default AppRouter;
