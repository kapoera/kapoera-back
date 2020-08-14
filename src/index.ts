import express from "express"

class App {
	public application : express.Application;
  
	constructor(){
		this.application = express();
		this.router();
	}

	private router(): void {
		this.application.get('/', (req: express.Request, res: express.Response) => {
			res.send('hello!');
		})	
	}
}
	  
const app = new App().application;
app.listen(3000,()=>console.log("start"));
