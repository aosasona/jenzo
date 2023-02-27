import App from "./app";

class Server {
  public static async run(app: App) {
    try {
      await app.listen();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
}

Server.run(new App());
