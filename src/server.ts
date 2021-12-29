import 'dotenv/config';
import '@/index';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import MoviesRoute from '@/routes/movies.route';
import validateEnv from '@utils/validateEnv';
import RatingsRoute from './routes/ratings.route';

validateEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new MoviesRoute(), new RatingsRoute()]);

app.listen();
