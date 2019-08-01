module.exports = {
    "/boards": require("../controllers/components/BoardController"),
    "/cards": require("../controllers/components/CardController"),
    "/columns": require("../controllers/components/ColumnController"),
    "/courses": require("../controllers/data/CourseController"),
    "": require("../controllers/DefaultController"),
    "/subjects": require("../controllers/data/SubjectController"),
    "/terms": require("../controllers/data/TermController"),
    "/users": require("../controllers/UserController")
};