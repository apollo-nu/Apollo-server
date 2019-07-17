module.exports = {
    "/boards": require("../controllers/components/BoardController"),
    "/cards": require("../controllers/components/CardController"),
    "/courses": require("../controllers/data/CourseController"),
    "": require("../controllers/DefaultController"),
    "/rows": require("../controllers/components/RowController"),
    "/subjects": require("../controllers/data/SubjectController"),
    "/terms": require("../controllers/data/TermController"),
    "/users": require("../controllers/UserController")
};