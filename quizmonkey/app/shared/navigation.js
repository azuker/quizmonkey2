const frameModule = require("ui/frame");

exports.goToQuizList = function () {
    const topmost = frameModule.topmost();
    topmost.navigate("views/quiz-list-view/quiz-list-view");
}

exports.goToQuestionView = function (quiz, index) {
    const topmost = frameModule.topmost();
    topmost.navigate({
        moduleName: 'views/question-view/question-view',
        context: { quiz: quiz, currentQuestionIndex: index },
        backstackVisible: false,
        transition: {
            name: "slide",
            duration: 350,
            curve: "easeIn"
        }
    });
}

exports.goToQuizSummaryView = function (quiz) {
    const topmost = frameModule.topmost();
    topmost.navigate({
        moduleName: 'views/quiz-summary-view/quiz-summary-view',
        bindingContext: quiz,
        backstackVisible: false,
        transition: {
            name: "slideTop",
            duration: 350,
            curve: "easeIn"
        }
    });
}
