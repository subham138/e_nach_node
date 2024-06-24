// MODULE & VARIABLE DECLIRATION
const express = require("express"),
  app = express(),
  port = process.env.PORT || 3000;
// END

// TO ACCEPT ALL DATA FROM CLIENT SIDE USING GET/POST REQUEST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// END

app.get("/", (req, res) => {
  res.send("Welcome");
});

const { ApiRouter } = require("./router/apiRouter");
app.use('/api', ApiRouter)

// SERVER LISTNING
app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`App is running at port ${port}`);
});
// END