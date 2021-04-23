const express = require("express");
const url = require("url");
const path = require("path");
const exphbs = require("express-handlebars");
// .................EXPRESS HANDLEBARS.....................
const app = express();
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
  })
);
app.set("view engine", "handlebars");

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const session = require("express-session");
const connectDatabase = require("./databaseConnection");
const usersSchema = require("./users");
const productSchema = require("./products");
const sepetimSchema = require("./sepetim");
/*productSchema.create(
  { ids: "1", name: "product1", price: 100, stockNumber: 10 },
  { ids: "2", name: "product2", price: 110, stockNumber: 10 },
  { ids: "3", name: "product3", price: 120, stockNumber: 10 },
  { ids: "4", name: "product4", price: 130, stockNumber: 10 }
); */
connectDatabase();
const PORT = 5000;
app.use(session({ secret: "some secrect message" }));
var sess;

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/" + "login.html");
});
app.post("/check", urlencodedParser, (req, res) => {
  sess = req.session;
  Response = {
    fname: req.body.first_name,
    lname: req.body.last_name,
  };
  usersSchema.findOne({ firstName: Response.fname }, function (err, user) {
    if (user) {
      sess.ufn = Response.fname; // giriş yapapn user için session oluşturuldu
      res.render("welcome", { name: sess.ufn });
    } else {
      res.render("welcome", { name: "you not logged in" });
    }
  });
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/" + "register.html");
});
app.post("/register_user", urlencodedParser, (req, res) => {
  Response = {
    fname: req.body.first_name,
    lname: req.body.last_name,
  };
  usersSchema.create({ firstName: Response.fname, lastName: Response.lname });
  res.sendFile(__dirname + "/" + "login.html");
});
app.get("/products", (req, res) => {
  productSchema.find({}, function (err, products) {
    let html = "<ul>";
    for (var i = 0; i < products.length; i++) {
      html +=
        "<li><a href=http://localhost:5000/item?id=" +
        products[i].ids +
        ">" +
        products[i].name +
        "</a>" +
        "</li>";
    }
    html += "<ul>";

    res.send(html);
  });
});
let itemId;
app.get("/item", (req, res) => {
  itemId = url.parse(req.url, true).query.id;
  productSchema.find({ ids: itemId }, function (err, product) {
    if (product) {
      var html =
        "<!DOCTYPE> <html>" +
        "<head><title>PRODUCT PAGE</title></head>" +
        "<body>" +
        "<h3 >ID=" +
        product[0].ids +
        "</h3><br>" +
        "<p >NAME=" +
        product[0].name +
        "</p><br>" +
        "<p >PRİCE=" +
        product[0].price +
        "</p><br>" +
        "<p >STOCK=" +
        product[0].stockNumber +
        "</p><br>" +
        "<a href=http://localhost:5000/products>" +
        "<form action=sepeteEkle method=POST><input type=submit value=SepeteEkle></form>" +
        "</a>" +
        "<a href=/products>Go to Products</a><br>"+
        "<form action=sepet method=GET><input type=submit value=SepeteGit></form>" +
        "<a href=http://localhost:5000/sepeteEkle></a>" +
        "</body> </html>";
      res.send(html);
    } else {
      res.send(err);
    }
  });
});
app.post("/sepeteEkle", (req, res) => {
  productSchema.find({ ids: itemId }, function (err, product) {
    if (product) {
      var name = product[0].name;
      var price = product[0].price;
      var stockNumber = product[0].stockNumber;
      sepetimSchema.create({
        productName: name,
        productPrice: price,
        stockNumber: stockNumber,
      });

      res.render("eklemeMesaji");
    }
  });
});
app.get("/sepet", (req, res) => {
  sepetimSchema.find({}, function (err, urun) {
    var html =
      "<!DOCTYPE> <html>" +
      "<head><title>PRODUCT PAGE</title></head>" +
      "<body><h2>ITEMS YOU HAVE IN YOUR SHOPPING CART </h2>";
    html += "<ul>";
    var totalPrice = 0;
    if (urun) {
      for (let i = 0; i < urun.length; i++) {
        totalPrice += urun[i].productPrice;
        html +=
          "<li>" +
          urun[i].productName +
          "---->" +
          urun[i].productPrice +
          "</li>";
      }
      html +=
        "<br><br><p><Strong>Total Price :" +
        totalPrice +
        "</Strong></p><br><br><form action=buy method=POST><input type=submit value=BUY></form><ul></body><html>";
      res.send(html);
    } else {
      res.send(err);
    }
  });
});
app.post("/buy", (req, res) => {
  sepetimSchema.find({}, function (err, products) {
    for (let i = 0; i < products.length; i++) {
      productSchema.findOneAndUpdate(
        { name: products[i].productName },
        { stockNumber: products[i].stockNumber - 1 },
        function (err, x) {}
      );
    }
    sepetimSchema.deleteMany({}, function (err, x) {
      if (x) {
        res.render("index");
      } else {
        res.send(err);
      }
    }); 
  });

  res.render("eklemeMesaji");
});
app.listen(5000, () => {
  console.log("server is started.");
});
