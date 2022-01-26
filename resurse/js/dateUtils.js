function callTranslate() {
    var allDates = document.getElementsByClassName("data-parsata");
    console.log(allDates);
    for (let i = 0 ; i < allDates.length ; i++) {
        makeDate(allDates[i]);
    }
}

function makeDate(record) {
    console.log(record);
    var dateSplitted = record.innerHTML.split(" ");
    //15(Sambata)/Septembrie/2018
    var day = translateDay(dateSplitted[0]);
    var month = translateMonth(dateSplitted[1]);
    record.innerHTML = dateSplitted[2] + '(' + day + ')/' + month + '/' + dateSplitted[3];
}

var translateDay = function(day) {
    if (day === 'Mon') {
        return 'Luni';
    } else if (day === 'Tue') {
        return 'Marti';
    } else if (day === 'Wed') {
        return 'Miercuri';
    } else if (day === 'Thu') {
        return 'Joi';
    } else if (day === 'Fri') {
        return 'Vineri';
    } else if (day === 'Sat') {
        return 'Sambata';
    } else if (day === 'Sun') {
        return 'Duminica';
    }
}

var translateMonth = function(month) {
    if (month === 'Jan') {
        return 'Ianuarie';
    } else if (month === 'Feb') {
        return 'Februarie';
    } else if (month === 'Mar') {
        return 'Martie';
    } else if (month === 'Apr') {
        return 'Aprilie';
    } else if (month === 'May') {
        return 'Mai';
    } else if (month === 'Jun') {
        return 'Iunie';
    } else if (month === 'Jul') {
        return 'Iulie';
    } else if (month === 'Aug') {
        return 'August';
    } else if (month === 'Sep') {
        return 'Septembrie';
    } else if (month === 'Oct') {
        return 'Octombrie';
    } else if (month === 'Nov') {
        return 'Noiembrie';
    } else if (month === 'Dec') {
        return 'Decembrie';
    }
}
