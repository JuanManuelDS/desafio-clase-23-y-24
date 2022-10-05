export const loginController = {
  auth: (req, res, next) => {
    if (req.session.username != undefined) {
      return next();
    }
    return res.status(401).render("pages/errorLogin");
  },
  get: (req, res) => {
    try {
      if (req.session.username != undefined) {
        res.render("pages/home", { name: req.session.username });
      } else {
        res.render("pages/login");
      }
    } catch (error) {
      return res
        .status(500)
        .send({ status: "Get page Log In error", body: error });
    }
  },
  postLogin: (req, res) => {
    try {
      const { username } = req.body;
      req.session.username = username;

      res.redirect("/home");
    } catch (error) {
      return res.status(500).send({ status: "Log In error", body: error });
    }
  },
};

// if (req.session?.user === "fran" && req.session?.admin) {
//   return next();
// }

// const { username, password } = req.body;
// if (username !== "fran" || password !== "123") {
//   return res.render("pages/errorLogin");
// }
// req.session.admin = true;
// var time = 600000;
// // req.session.cookie.expires = new Date(Date.now() + time);
// req.session.cookie.maxAge = new Date(Date.now() + time);
