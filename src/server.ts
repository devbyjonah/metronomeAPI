import App from "./app";
import AuthRoute from "./routes/auth";
import IndexRoute from "./routes/index";

const app = new App([new AuthRoute(), new IndexRoute()]);

app.listen();
