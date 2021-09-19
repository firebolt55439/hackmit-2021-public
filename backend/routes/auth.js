var express = require("express");
var passport = require("passport");
var crypto = require("crypto");
const LocalStrategy = require("passport-local");

const db = require("../db/index");

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const row = await db.get(
        "SELECT * FROM classcaster_schema.users WHERE username = $1",
        [username]
      );
      if (!row) {
        return cb(null, false, {
          message: "Incorrect username or password.",
        });
      }
      crypto.pbkdf2(
        password,
        Buffer.from(JSON.parse(row.salt).data),
        10000,
        32,
        "sha256",
        function (err, hashedPassword) {
          if (err) {
            return cb(err);
          }
          if (
            !crypto.timingSafeEqual(
              Buffer.from(JSON.parse(row.password_hash).data),
              hashedPassword
            )
          ) {
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }

          var user = {
            id: row.id.toString(),
            username: row.username,
            displayName: row.name,
          };
          return cb(null, user);
        }
      );
    } catch (e) {
      return cb(e);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

var router = express.Router();

/* GET users listing. */
router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect:
      "/dashboard?_msg=Authenticated%20user.&_title=Success!&_status=success",
    failureRedirect:
      "/login?_msg=Invalid%20credentials.&_title=Failure&_status=error",
    failureMessage: true,
  })
);

router.post("/logout", function (req, res, next) {
  req.logout();
  res.redirect("/?_msg=Logged%20you%20out!&_title=Success&_status=success");
});

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.post("/signup", function (req, res, next) {
  var salt = crypto.randomBytes(32);
  crypto.pbkdf2(
    req.body.password,
    salt,
    10000,
    32,
    "sha256",
    async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      try {
        const output = await db.run(
          "INSERT INTO classcaster_schema.users (username, password_hash, salt, name) VALUES ($1, $2, $3, $4) RETURNING id",
          [
            req.body.username,
            JSON.stringify(hashedPassword),
            JSON.stringify(salt),
            req.body.name,
          ],
          /*retries=*/ 2
        );

        const row = output.rows[0];

        var user = {
          id: row.id.toString(),
          username: req.body.username,
          displayName: req.body.name,
        };

        req.login(user, function (err) {
          if (err) {
            return next(err);
          }

          res.redirect(
            "/dashboard?_msg=Registered%20user.&_title=Success!&_status=success"
          );
        });
      } catch (err) {
        return next(err);
      }
    }
  );
});

module.exports = router;
