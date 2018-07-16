const QuestionViewModel = require('../../shared/view-models/question-view-model');
const observableModule = require("data/observable");
const NavigationModule = require("../../shared/navigation");
const mapsModule = require("nativescript-google-maps-sdk");

let mapView = null;
let vm;
let quiz
let questionIndex;
let quizLength;
let answerSelected = false;
let questionData = new observableModule.Observable();


setBackgroundColor = function () {
    let colors = ['#58406D', '#314D70', '#E54B04', '#007461', '#655672', '#6B0758', '#513EE1', '#E00481', '#4D989E', '#3F7F47'];
    let backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    questionData.backgroundColor = backgroundColor;
}

navigateToNextPage = function () {
    if (quizLength > questionIndex + 1) {
        NavigationModule.goToQuestionView(quiz, questionIndex + 1);
    }
    else {
        quiz.finalizeScore();
        NavigationModule.goToQuizSummaryView(quiz);
    };
}

showCorrectMarker = function (args) {
    args.map.addMarkers([{
        lat: vm.locationAnswer.latitude,
        lng: vm.locationAnswer.longitude,
        icon: "http://gnesher.com/wp-content/uploads/markers/blue-marker.png"
    }]);
}

showUserMarker = function (args, answeredCorrectly, point) {
    let iconUrl;
    if (answeredCorrectly)
        iconUrl = "http://gnesher.com/wp-content/uploads/markers/green-marker.png";
    else
        iconUrl = "http://gnesher.com/wp-content/uploads/markers/red-marker.png";
    args.map.addMarkers([{
        lat: point.lat,
        lng: point.lng,
        icon: iconUrl
    }]);
}

coordinateTapped = function (args, point) {
    let answeredCorrectly = vm.checkMapLocationAnswer(point.lat, point.lng);
    showUserMarker(args, answeredCorrectly, point);
    setTimeout(() => showCorrectMarker(args, answeredCorrectly), 500);
    if (answeredCorrectly) {
        quiz.incrementScore();
    }
    setTimeout(navigateToNextPage, 2000);
}

showCorrectMarker = function () {
    var correctMarker = new mapsModule.Marker();
    var correctLat = vm.locationAnswer.latitude;
    var correctLong = vm.locationAnswer.longitude;
    correctMarker.position = mapsModule.Position.positionFromLatLng(correctLat, correctLong);
    correctMarker.color = 'green';
    mapView.addMarker(correctMarker);
}

showUserMarker = function (args, answeredCorrectly) {
    var userMarker = new mapsModule.Marker();
    userMarker.position = mapsModule.Position.positionFromLatLng(args.position.latitude, args.position.longitude);
    userMarker.icon = answeredCorrectly ? 'vmarkmap' : 'xmarkmap';
    userMarker.anchor = [0.5, 0.5];
    mapView.addMarker(userMarker);
}


exports.onMapReady = function (args) {
    mapView = args.object;
    mapView.settings.compassEnabled = false;
    mapView.settings.indoorLevelPickerEnabled = false;
    mapView.settings.mapToolbarEnabled = false;
    mapView.settings.myLocationButtonEnabled = false;
    mapView.settings.rotateGesturesEnabled = false;
    mapView.settings.scrollGesturesEnabled = false;
    mapView.settings.tiltGesturesEnabled = false;
    mapView.settings.zoomControlsEnabled = false;
    mapView.settings.zoomGesturesEnabled = false;
}

exports.onCoordinateTapped = function (args) {
    if (!answerSelected) {
        answerSelected = true;
        let answeredCorrectly = vm.checkMapLocationAnswer(args.position.latitude, args.position.longitude);
        showUserMarker(args, answeredCorrectly);
        setTimeout(showCorrectMarker, 500);
        if (answeredCorrectly) {
            quiz.incrementScore();
        }

        setTimeout(navigateToNextPage, 2000);
    }
}

exports.onQuestionPageLoaded = function (args) {
    let page = args.object;
    page.bindingContext = questionData;
}

exports.questionPageNavigatingTo = function (args) {
    let page = args.object;
    let context = page.navigationContext;
    answerSelected = false;
    quiz = context.quiz;
    questionIndex = context.currentQuestionIndex;
    quizLength = quiz.questions.length;
    vm = new QuestionViewModel(quiz.questions[questionIndex]);
    vm.initQuestion();
    questionData.question = vm;
    questionData.progress = `${questionIndex + 1} / ${quizLength}`;
    setBackgroundColor();
}

exports.onSelectMultipleChoiceAnswer = function (args) {
    if (!answerSelected) {
        answerSelected = true;
        let chosenAnswer = args.view.bindingContext;
        let answeredCorrectly = vm.checkMultipleChoiceAnswer(chosenAnswer);
        if (answeredCorrectly) {
            quiz.incrementScore();
        }
        setTimeout(navigateToNextPage, 1000);
    }
}