export class functions {
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    colorNames(int) {
        let colorName;
        //https://www.w3schools.com/colors/colors_groups.asp
        if (int >= 12)
            return '3, 11, 252'; //'Yellow';
        if (int >= 8)
            return '3, 148, 252'; //'Gold';
        if (int >= 4)
            return '3, 223, 252'; //'OrangeRed';
        if (int >= 0)
            return '3, 252, 248'; //'Cyan';
    }
    dateDiff(newDate, oldDate) {
        var diff = Math.round(Math.abs(newDate - oldDate));
        return diff; //difference between two dates, in milliseconds
    }
}
//# sourceMappingURL=functions.js.map