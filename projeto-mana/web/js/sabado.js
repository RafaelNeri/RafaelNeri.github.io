navigator.geolocation.getCurrentPosition(function(position) {
    var nowDate = new Date();
    var times = SunCalc.getTimes(nowDate, position.coords.latitude, position.coords.longitude);
    if (
        !((nowDate.getDay() == 5 && nowDate > times.sunset) ||
        (nowDate.getDay() == 6 && nowDate < times.sunset)) ) {
        window.location = '/catalogo.html'
    }
});