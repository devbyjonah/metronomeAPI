import App from "./app";
import AuthRoute from "./routes/auth";
import IndexRoute from "./routes/index";
import UserRoute from "./routes/user";

const app = new App([new AuthRoute(), new IndexRoute(), new UserRoute()]);

app.listen();
