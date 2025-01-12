// amit-ofeck-322317306-ortal-ben-david-209898907
import initApp from "./index";
const port = process.env.PORT;
import * as dotenv from 'dotenv';

dotenv.config();

initApp().then((app) => {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
});