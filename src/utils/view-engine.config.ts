import path from 'path'
const  setupView  = (app, engine) =>  {
    app.set("view engine", "hbs");
    app.engine(
      "hbs",
      engine({
        extname: "hbs",
        layoutsDir: path.join(__dirname, '..', "views", "layouts"),
        partialsDir: path.join(__dirname, '..', "views", "partials"),
        helpers: {
          firstImage: function (images) {
            return images[0];
          },
        },
      })
    );
    app.set("views", path.join(__dirname, '..', "views"));
}


export default setupView